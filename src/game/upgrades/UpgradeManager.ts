import { Decimal } from 'break_infinity.js';
import { Upgrade, UpgradeConfig } from './Upgrade';
import { allUpgrades } from '@/data/upgrades';

export class UpgradeManager {
  private static instance: UpgradeManager;
  private upgrades: Map<string, Upgrade> = new Map();

  private constructor() {
    this.initUpgrades();
  }

  static getInstance(): UpgradeManager {
    if (!UpgradeManager.instance) {
      UpgradeManager.instance = new UpgradeManager();
    }
    return UpgradeManager.instance;
  }

  private initUpgrades(): void {
    for (const config of allUpgrades) {
      const upgrade = new Upgrade(config);
      this.upgrades.set(config.id, upgrade);
    }
  }

  getUpgrade(id: string): Upgrade | undefined {
    return this.upgrades.get(id);
  }

  getAllUpgrades(): Upgrade[] {
    return Array.from(this.upgrades.values());
  }

  getAvailableUpgrades(): Upgrade[] {
    return this.getAllUpgrades().filter(u => u.canPurchase);
  }

  getPurchasedUpgrades(): Upgrade[] {
    return this.getAllUpgrades().filter(u => u.currentStage > 0);
  }

  canPurchase(id: string, currency: Decimal): boolean {
    const upgrade = this.upgrades.get(id);
    if (!upgrade || !upgrade.canPurchase) return false;
    return currency.gte(upgrade.cost);
  }

  purchase(id: string): boolean {
    const upgrade = this.upgrades.get(id);
    if (!upgrade || !upgrade.canPurchase) return false;
    upgrade.buy();
    return true;
  }

  getGlobalTEMultiplier(): number {
    let multiplier = 1;
    for (const upgrade of this.upgrades.values()) {
      if (upgrade.effect.type === 'multiplier' && upgrade.effect.target === 'TE') {
        multiplier *= 1 + upgrade.getEffectiveness();
      }
    }
    return multiplier;
  }

  getGeneratorMultiplier(generatorId: string): number {
    let multiplier = 1;
    for (const upgrade of this.upgrades.values()) {
      if (upgrade.effect.type === 'enhance' && upgrade.effect.target === generatorId) {
        multiplier *= 1 + upgrade.getEffectiveness();
      }
      if (upgrade.effect.type === 'multiplier' && upgrade.effect.target === generatorId) {
        multiplier *= 1 + upgrade.getEffectiveness();
      }
    }
    return multiplier;
  }

  reset(): void {
    for (const upgrade of this.upgrades.values()) {
      upgrade.reset();
    }
  }

  save(): Record<string, number> {
    const data: Record<string, number> = {};
    for (const upgrade of this.upgrades.values()) {
      data[upgrade.id] = upgrade.currentStage;
    }
    return data;
  }

  load(data: Record<string, number>): void {
    for (const [id, stage] of Object.entries(data)) {
      const upgrade = this.upgrades.get(id);
      if (upgrade) {
        upgrade.currentStage = stage;
      }
    }
  }
}