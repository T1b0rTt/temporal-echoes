import { Decimal } from 'break_infinity.js';
import { Game } from '@/core/Game';

export interface EpochalTranscendenceResult {
  timeCrystalsGained: Decimal;
  totalZK: Decimal;
}

export class EpochalTranscendence {
  private static instance: EpochalTranscendence;

  private constructor() {}

  static getInstance(): EpochalTranscendence {
    if (!EpochalTranscendence.instance) {
      EpochalTranscendence.instance = new EpochalTranscendence();
    }
    return EpochalTranscendence.instance;
  }

  public calculateTimeCrystals(timeCrystals: Decimal): Decimal {
    const logZK = timeCrystals.log10();
    if (logZK.lt(6)) {
      return new Decimal(0);
    }
    return new Decimal(4).mul(Math.pow(logZK.toNumber() - 4, 1.5)).floor();
  }

  public canTranscend(timeCrystals: Decimal): boolean {
    return timeCrystals.gte(1e6);
  }

  public getTranscendenceRequirement(): string {
    return '1e6 ZK';
  }

  public performTranscendence(): EpochalTranscendenceResult {
    const game = Game.getInstance();
    const zk = game.timeCrystals.amount;

    if (!this.canTranscend(zk)) {
      return {
        timeCrystalsGained: new Decimal(0),
        totalZK: new Decimal(0),
      };
    }

    const zkGained = this.calculateTimeCrystals(zk);
    const currentZK = game.timeCrystals.amount;
    const totalZK = currentZK.add(zkGained);

    this.resetGame();

    return {
      timeCrystalsGained: zkGained,
      totalZK: totalZK,
    };
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

  public getTranscendenceInfo(timeCrystals: Decimal): {
    canTranscend: boolean;
    timeCrystals: string;
    requirement: string;
  } {
    const canTranscend = this.canTranscend(timeCrystals);
    const zk = this.calculateTimeCrystals(timeCrystals);

    return {
      canTranscend,
      timeCrystals: zk.toFixed(0),
      requirement: this.getTranscendenceRequirement(),
    };
  }
}