import Decimal from 'break_infinity.js';

export interface UpgradeConfig {
  id: string;
  name: string;
  description: string;
  cost: number;
  costScaling: number;
  maxStages: number;
  effect: UpgradeEffect;
  requirement?: UpgradeRequirement;
}

export interface UpgradeEffect {
  type: 'multiplier' | 'autobuyer' | 'enhance';
  target: string;
  value?: number;
}

export interface UpgradeRequirement {
  type: 'generator' | 'upgrade' | 'currency';
  id: string;
  stage?: number;
  amount?: number;
}

export class Upgrade {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly baseCost: Decimal;
  public readonly costScaling: number;
  public readonly maxStages: number;
  public readonly effect: UpgradeEffect;
  public readonly requirement?: UpgradeRequirement;

  public currentStage: number = 0;

  constructor(config: UpgradeConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.baseCost = new Decimal(config.cost);
    this.costScaling = config.costScaling;
    this.maxStages = config.maxStages;
    this.effect = config.effect;
    this.requirement = config.requirement;
  }

  get cost(): Decimal {
    if (this.currentStage >= this.maxStages) {
      return new Decimal(Infinity);
    }
    return this.baseCost.mul(Math.pow(this.costScaling, this.currentStage));
  }

  get isMaxed(): boolean {
    return this.currentStage >= this.maxStages;
  }

  get canPurchase(): boolean {
    return !this.isMaxed;
  }

  getEffectiveness(): number {
    return this.effect.value ? this.effect.value * this.currentStage : 0;
  }

  buy(): void {
    if (this.canPurchase) {
      this.currentStage++;
    }
  }

  reset(): void {
    this.currentStage = 0;
  }

  applyEffect(value: Decimal): Decimal {
    switch (this.effect.type) {
      case 'multiplier':
        return value.mul(1 + this.getEffectiveness());
      case 'enhance':
        return value.mul(1 + this.getEffectiveness());
      default:
        return value;
    }
  }
}