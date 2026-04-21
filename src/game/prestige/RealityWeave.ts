import Decimal from 'break_infinity.js';
import { Game } from '@/core/Game';

export class RealityWeave {
  private static instance: RealityWeave;

  private constructor() {}

  static getInstance(): RealityWeave {
    if (!RealityWeave.instance) {
      RealityWeave.instance = new RealityWeave();
    }
    return RealityWeave.instance;
  }

  public calculateRealityStrands(timeCrystals: Decimal): Decimal {
    const logZK = timeCrystals.log10();
    if (logZK.lt(9)) {
      return new Decimal(0);
    }
    return new Decimal(3).mul(Math.pow(logZK.toNumber() - 7, 1.5)).floor();
  }

  public canWeave(timeCrystals: Decimal): boolean {
    return timeCrystals.gte(1e9);
  }

  public getWeaveRequirement(): string {
    return '1e9 ZK';
  }

  public performWeave(): { strandsGained: Decimal; totalRS: Decimal } {
    const game = Game.getInstance();
    const zk = game.timeCrystals.amount;

    if (!this.canWeave(zk)) {
      return { strandsGained: new Decimal(0), totalRS: new Decimal(0) };
    }

    const rsGained = this.calculateRealityStrands(zk);
    const currentRS = game.realityStrands.amount;
    const totalRS = currentRS.add(rsGained);

    this.resetGame();

    return { strandsGained: rsGained, totalRS: totalRS };
  }

  private resetGame(): void {
    const game = Game.getInstance();

    for (const generator of game.getAllGenerators()) {
      generator.count = new Decimal(0);
      if (generator.id === 'EC1' || generator.id === 'EC2' || generator.id === 'EC3' || generator.id === 'EC4') {
        generator.isUnlocked = true;
      } else {
        generator.isUnlocked = false;
      }
    }

    for (const dimension of game.getAllDimensions()) {
      dimension.count = new Decimal(0);
      dimension.isUnlocked = false;
    }

    game.temporalEnergy.reset();
    game.timeCrystals.reset();
    game.tickCount = 0;
    game.currentTDT = 1;
  }

  public getWeaveInfo(timeCrystals: Decimal): { canWeave: boolean; strands: string; requirement: string } {
    const canWeave = this.canWeave(timeCrystals);
    const rs = this.calculateRealityStrands(timeCrystals);

    return {
      canWeave,
      strands: rs.toFixed(0),
      requirement: this.getWeaveRequirement(),
    };
  }
}