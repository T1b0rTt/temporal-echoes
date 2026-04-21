import Decimal from 'break_infinity.js';
import { Game } from '@/core/Game';

export class CelestialAscension {
  private static instance: CelestialAscension;

  private constructor() {}

  static getInstance(): CelestialAscension {
    if (!CelestialAscension.instance) {
      CelestialAscension.instance = new CelestialAscension();
    }
    return CelestialAscension.instance;
  }

  public calculateCelestialOrbs(nexusFragments: Decimal): Decimal {
    const logNF = nexusFragments.log10();
    if (logNF.lt(6)) return new Decimal(0);
    return new Decimal(1).mul(Math.pow(logNF.toNumber() - 4, 1.5)).floor();
  }

  public canAscend(nexusFragments: Decimal): boolean {
    return nexusFragments.gte(1e6);
  }

  public getAscendRequirement(): string {
    return '1e6 NF';
  }

  public performAscend(): { orbsGained: Decimal; totalHO: Decimal } {
    const game = Game.getInstance();
    const nf = game.nexusFragments.amount;

    if (!this.canAscend(nf)) {
      return { orbsGained: new Decimal(0), totalHO: new Decimal(0) };
    }

    const hoGained = this.calculateCelestialOrbs(nf);
    const currentHO = game.celestialOrbs.amount;
    const totalHO = currentHO.add(hoGained);

    this.resetGame();

    return { orbsGained: hoGained, totalHO };
  }

  private resetGame(): void {
    const game = Game.getInstance();
    for (const g of game.getAllGenerators()) {
      g.count = new Decimal(0);
      if (g.id === 'EC1' || g.id === 'EC2' || g.id === 'EC3' || g.id === 'EC4') g.isUnlocked = true;
      else g.isUnlocked = false;
    }
    for (const d of game.getAllDimensions()) {
      d.count = new Decimal(0);
      d.isUnlocked = false;
    }
    game.temporalEnergy.reset();
    game.timeCrystals.reset();
    game.tickCount = 0;
    game.currentTDT = 1;
  }

  public getAscendInfo(nexusFragments: Decimal): { canAscend: boolean; orbs: string; requirement: string } {
    return {
      canAscend: this.canAscend(nexusFragments),
      orbs: this.calculateCelestialOrbs(nexusFragments).toFixed(0),
      requirement: this.getAscendRequirement(),
    };
  }
}