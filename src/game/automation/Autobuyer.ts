import { Game } from '@/core/Game';
import Decimal from 'break_infinity.js';

export interface AutobuyerConfig {
  id: string;
  generatorId: string;
  maxCount: number;
  priority: number;
  enabled: boolean;
}

export class Autobuyer {
  private static instance: Autobuyer;
  private autobuyers: Map<string, AutobuyerConfig> = new Map();
  private tickCounter: number = 0;
  private buyInterval: number = 30;

  private constructor() {
    this.initDefaultAutobuyers();
  }

  static getInstance(): Autobuyer {
    if (!Autobuyer.instance) {
      Autobuyer.instance = new Autobuyer();
    }
    return Autobuyer.instance;
  }

  private initDefaultAutobuyers(): void {
    const generators = ['EC1', 'EC2', 'EC3', 'EC4', 'EC5', 'EC6', 'EC7', 'EC8'];
    for (let i = 0; i < generators.length; i++) {
      const id = `auto_${generators[i]}`;
      this.autobuyers.set(id, {
        id,
        generatorId: generators[i],
        maxCount: 100,
        priority: i,
        enabled: false,
      });
    }
  }

  public getAutobuyer(id: string): AutobuyerConfig | undefined {
    return this.autobuyers.get(id);
  }

  public getAllAutobuyers(): AutobuyerConfig[] {
    return Array.from(this.autobuyers.values()).sort((a, b) => a.priority - b.priority);
  }

  public setEnabled(id: string, enabled: boolean): void {
    const autobuyer = this.autobuyers.get(id);
    if (autobuyer) {
      autobuyer.enabled = enabled;
    }
  }

  public setMaxCount(id: string, maxCount: number): void {
    const autobuyer = this.autobuyers.get(id);
    if (autobuyer) {
      autobuyer.maxCount = maxCount;
    }
  }

  public tick(): void {
    this.tickCounter++;
    if (this.tickCounter < this.buyInterval) return;
    this.tickCounter = 0;

    const game = Game.getInstance();
    const enabledAutobuyers = this.getAllAutobbuyers()
      .filter(a => a.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const autobuyer of enabledAutobuyers) {
      const generator = game.getGenerator(autobuyer.generatorId);
      if (!generator || !generator.isUnlocked) continue;
      if (generator.count.gte(autobuyer.maxCount)) continue;

      const cost = generator.cost;
      if (game.temporalEnergy.amount.gte(cost)) {
        game.buyGenerator(autobuyer.generatorId, game.temporalEnergy.amount);
      }
    }
  }

  public reset(): void {
    for (const autobuyer of this.autobuyers.values()) {
      autobuyer.enabled = false;
      autobuyer.maxCount = 100;
    }
  }

  public save(): Record<string, any> {
    const data: Record<string, any> = {};
    for (const [id, config] of this.autobuyers) {
      data[id] = {
        enabled: config.enabled,
        maxCount: config.maxCount,
      };
    }
    return data;
  }

  public load(data: Record<string, any>): void {
    for (const [id, config] of Object.entries(data)) {
      const autobuyer = this.autobuyers.get(id);
      if (autobuyer) {
        autobuyer.enabled = config.enabled;
        autobuyer.maxCount = config.maxCount;
      }
    }
  }
}