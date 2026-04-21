import { Decimal } from 'break_infinity.js';
import { num } from '@/core/NumberManager';
import { GameLoop } from './GameLoop';
import { TemporalEnergy } from '@/game/currencies/TemporalEnergy';
import { Generator } from '@/game/generators/Generator';
import { echoCollectors } from '@/data/generators';

export class Game {
  private static instance: Game;

  private gameLoop: GameLoop;
  public temporalEnergy: TemporalEnergy;
  public generators: Map<string, Generator> = new Map();
  public tickCount: number = 0;

  private constructor() {
    this.temporalEnergy = new TemporalEnergy();
    this.initGenerators();
    this.gameLoop = new GameLoop(this.processTick.bind(this));
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  private initGenerators(): void {
    for (const config of echoCollectors) {
      const generator = new Generator(config);
      generator.isUnlocked = true;
      this.generators.set(config.id, generator);
    }
  }

  start(): void {
    this.gameLoop.start();
  }

  stop(): void {
    this.gameLoop.stop();
  }

  processTick(deltaTime: number): void {
    this.tickCount++;

    for (const generator of this.generators.values()) {
      if (!generator.isUnlocked) continue;

      const production = generator.baseProduction.mul(generator.count).mul(deltaTime);
      this.temporalEnergy.add(production);
    }
  }

  click(): void {
    this.temporalEnergy.add(1);
  }

  buyGenerator(id: string, currency: Decimal): boolean {
    const generator = this.generators.get(id);
    if (!generator || !generator.isUnlocked) return false;

    const cost = generator.cost;
    if (currency.lt(cost)) return false;

    generator.buy();
    return true;
  }

  getGenerator(id: string): Generator | undefined {
    return this.generators.get(id);
  }

  getAllGenerators(): Generator[] {
    return Array.from(this.generators.values());
  }

  reset(): void {
    for (const generator of this.generators.values()) {
      generator.reset();
    }
    this.temporalEnergy.reset();
    this.tickCount = 0;
  }
}