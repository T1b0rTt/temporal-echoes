import { Decimal } from 'break_infinity.js';
import { num } from '@/core/NumberManager';
import { GameLoop } from './GameLoop';
import { TemporalEnergy } from '@/game/currencies/TemporalEnergy';
import { Generator } from '@/game/generators/Generator';
import { echoCollectors, temporalDimensions } from '@/data/generators';

export class Game {
  private static instance: Game;

  private gameLoop: GameLoop;
  public temporalEnergy: TemporalEnergy;
  public generators: Map<string, Generator> = new Map();
  public dimensions: Map<string, Generator> = new Map();
  public tickCount: number = 0;

  public currentTDT: number = 1;
  public bestTDT: number = 1;

  private unlockThresholds: Record<string, number> = {
    EC5: 10,
    EC6: 10,
    EC7: 10,
    EC8: 10,
    TD1: 1,
    TD2: 1,
    TD3: 1,
    TD4: 1,
    TD5: 1,
    TD6: 1,
    TD7: 1,
    TD8: 1,
  };

  private constructor() {
    this.temporalEnergy = new TemporalEnergy();
    this.initGenerators();
    this.initDimensions();
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
      this.generators.set(config.id, generator);
    }
  }

  private initDimensions(): void {
    for (const config of temporalDimensions) {
      const dimension = new Generator(config);
      this.dimensions.set(config.id, dimension);
    }
  }

  public getTotalTEConsumed(): Decimal {
    let total = new Decimal(0);
    for (const generator of this.generators.values()) {
      const cost = generator.baseCost.mul(
        (Math.pow(generator.costGrowth, generator.count.toNumber()) - 1) / (generator.costGrowth - 1)
      );
      total = total.add(cost);
    }
    return total;
  }

  public getActiveGenerators(): Generator[] {
    return Array.from(this.generators.values()).filter(g => g.isUnlocked);
  }

  public getActiveDimensions(): Generator[] {
    return Array.from(this.dimensions.values()).filter(d => d.isUnlocked && d.count.gt(0));
  }

  public getTDTMultiplier(): number {
    return this.currentTDT;
  }

  public canDoDimensionShift(): boolean {
    return this.temporalEnergy.amount.gte(1e6);
  }

  public doDimensionShift(): Decimal {
    if (!this.canDoDimensionShift()) {
      return new Decimal(0);
    }

    const esGained = this.calculateEchoShards();
    const tdtIncrease = this.temporalEnergy.amount.log10().div(1e6).toNumber() * 0.01;
    this.currentTDT += Math.max(0.01, tdtIncrease);

    if (this.currentTDT > this.bestTDT) {
      this.bestTDT = this.currentTDT;
    }

    this.reset();
    return esGained;
  }

  private calculateEchoShards(): Decimal {
    const te = this.temporalEnergy.amount;
    if (te.lt(1e12)) return new Decimal(0);
    const logTE = te.log10();
    return new Decimal(5).mul(Math.pow(logTE.toNumber() - 10, 1.5)).floor();
  }

  public updateUnlocks(): void {
    const thresholds: Record<string, { prev: string; count: number }> = {
      EC5: { prev: 'EC4', count: 10 },
      EC6: { prev: 'EC5', count: 10 },
      EC7: { prev: 'EC6', count: 10 },
      EC8: { prev: 'EC7', count: 10 },
    };

    for (const [id, req] of Object.entries(thresholds)) {
      const generator = this.generators.get(id);
      if (!generator) continue;

      if (!generator.isUnlocked) {
        const prevGenerator = this.generators.get(req.prev);
        if (prevGenerator && prevGenerator.count.gte(req.count)) {
          generator.isUnlocked = true;
        }
      }
    }

    this.checkDimensionUnlocks();
  }

  public checkDimensionUnlocks(): void {
    const totalTEConsumed = this.getTotalTEConsumed();
    const dimThresholds = [
      { id: 'TD2', te: 1e6 },
      { id: 'TD3', te: 1e9 },
      { id: 'TD4', te: 1e12 },
      { id: 'TD5', te: 1e15 },
      { id: 'TD6', te: 1e18 },
      { id: 'TD7', te: 1e21 },
      { id: 'TD8', te: 1e24 },
    ];

    for (const { id, te } of dimThresholds) {
      const dimension = this.dimensions.get(id);
      if (!dimension || dimension.isUnlocked) continue;

      if (totalTEConsumed.gte(te)) {
        dimension.isUnlocked = true;
      }
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

    const tdtMultiplier = this.getTDTMultiplier();
    const effectiveDelta = deltaTime * tdtMultiplier;

    for (const generator of this.generators.values()) {
      if (!generator.isUnlocked) continue;

      let production = generator.baseProduction.mul(generator.count).mul(effectiveDelta);

      if (generator.id === 'EC2') {
        const ec1 = this.generators.get('EC1');
        if (ec1) {
          production = ec1.production.mul(0.1).mul(generator.count);
        }
      }

      this.temporalEnergy.add(production);
    }

    this.updateUnlocks();
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

  getUnlockedGenerators(): Generator[] {
    return Array.from(this.generators.values()).filter(g => g.isUnlocked);
  }

  getAllDimensions(): Generator[] {
    return Array.from(this.dimensions.values());
  }

  getUnlockedDimensions(): Generator[] {
    return Array.from(this.dimensions.values()).filter(d => d.isUnlocked);
  }

  buyDimension(id: string): boolean {
    const dimension = this.dimensions.get(id);
    if (!dimension || !dimension.isUnlocked) return false;

    const cost = dimension.cost;
    if (this.temporalEnergy.amount.lt(cost)) return false;

    this.temporalEnergy.subtract(cost);
    dimension.buy();
    return true;
  }

  getDimension(id: string): Generator | undefined {
    return this.dimensions.get(id);
  }

  getDimensionShiftCost(): Decimal {
    return new Decimal(1e6);
  }

  reset(): void {
    for (const generator of this.generators.values()) {
      generator.reset();
    }
    this.temporalEnergy.reset();
    this.tickCount = 0;
  }
}