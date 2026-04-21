import { Decimal } from 'break_infinity.js';
import { num } from '@/core/NumberManager';

export interface GeneratorConfig {
  id: string;
  name: string;
  description?: string;
  baseCost: number;
  costGrowth: number;
  baseProduction: number;
  produces: string;
  unlockCondition?: () => boolean;
}

export class Generator {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly baseCost: Decimal;
  public readonly costGrowth: number;
  public readonly baseProduction: Decimal;
  public readonly produces: string;
  public readonly unlockCondition?: () => boolean;

  public count: Decimal = num.create(0);
  public isUnlocked: boolean = false;

  constructor(config: GeneratorConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.baseCost = num.create(config.baseCost);
    this.costGrowth = config.costGrowth;
    this.baseProduction = num.create(config.baseProduction);
    this.produces = config.produces;
    this.unlockCondition = config.unlockCondition;
  }

  get cost(): Decimal {
    return this.baseCost.mul(Math.pow(this.costGrowth, this.count.toNumber()));
  }

  get production(): Decimal {
    return this.baseProduction.mul(this.count);
  }

  canAfford(currency: Decimal): boolean {
    return currency.gte(this.cost);
  }

  canUnlock(): boolean {
    return this.unlockCondition ? this.unlockCondition() : true;
  }

  buy(): void {
    this.count = this.count.add(1);
  }

  buyMultiple(amount: number): void {
    this.count = this.count.add(amount);
  }

  reset(): void {
    this.count = num.create(0);
  }

  formatCount(): string {
    return this.count.toFixed(0);
  }
}