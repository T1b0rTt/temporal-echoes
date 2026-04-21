import Decimal from 'break_infinity.js';
import { Game } from '@/core/Game';

export class Nexus {
  private static instance: Nexus;

  private constructor() {}

  static getInstance(): Nexus {
    if (!Nexus.instance) {
      Nexus.instance = new Nexus();
    }
    return Nexus.instance;
  }

  public calculateNexusFragments(realityStrands: Decimal): Decimal {
    const logRS = realityStrands.log10();
    if (logRS.lt(6)) return new Decimal(0);
    return new Decimal(2).mul(Math.pow(logRS.toNumber() - 4, 1.5)).floor();
  }

  public canAscend(realityStrands: Decimal): boolean {
    return realityStrands.gte(1e6);
  }

  public getAscendRequirement(): string {
    return '1e6 RS';
  }

  public performAscend(): { fragmentsGained: Decimal; totalNF: Decimal } {
    const game = Game.getInstance();
    const rs = game.realityStrands.amount;

    if (!this.canAscend(rs)) {
      return { fragmentsGained: new Decimal(0), totalNF: new Decimal(0) };
    }

    const nfGained = this.calculateNexusFragments(rs);
    const currentNF = game.nexusFragments.amount;
    const totalNF = currentNF.add(nfGained);

    this.resetGame();

    return { fragmentsGained: nfGained, totalNF };
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

  public getAscendInfo(realityStrands: Decimal): { canAscend: boolean; fragments: string; requirement: string } {
    return {
      canAscend: this.canAscend(realityStrands),
      fragments: this.calculateNexusFragments(realityStrands).toFixed(0),
      requirement: this.getAscendRequirement(),
    };
  }
}