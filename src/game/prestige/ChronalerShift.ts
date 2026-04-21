import Decimal from 'break_infinity.js';
import { Game } from '@/core/Game';

export interface ChronalerShiftResult {
  echoShardsGained: Decimal;
  totalES: Decimal;
}

export class ChronalerShift {
  private static instance: ChronalerShift;

  private constructor() {}

  static getInstance(): ChronalerShift {
    if (!ChronalerShift.instance) {
      ChronalerShift.instance = new ChronalerShift();
    }
    return ChronalerShift.instance;
  }

  public calculateEchoShards(temporalEnergy: Decimal): Decimal {
    const logTE = temporalEnergy.log10();
    if (logTE.lt(12)) {
      return new Decimal(0);
    }
    return new Decimal(5).mul(Math.pow(logTE.toNumber() - 10, 1.5)).floor();
  }

  public canShift(temporalEnergy: Decimal): boolean {
    return temporalEnergy.gte(1e12);
  }

  public getShiftRequirement(): string {
    return '1e12 TE';
  }

  public performShift(): ChronalerShiftResult {
    const game = Game.getInstance();
    const te = game.temporalEnergy.amount;

    if (!this.canShift(te)) {
      return {
        echoShardsGained: new Decimal(0),
        totalES: new Decimal(0),
      };
    }

    const esGained = this.calculateEchoShards(te);
    const currentES = game.echoShards.amount;
    const totalES = currentES.add(esGained);

    this.resetGame();

    return {
      echoShardsGained: esGained,
      totalES: totalES,
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
    game.tickCount = 0;
    game.currentTDT = 1;
  }

  public getShiftInfo(temporalEnergy: Decimal): {
    canShift: boolean;
    echoShards: string;
    requirement: string;
  } {
    const canShift = this.canShift(temporalEnergy);
    const es = this.calculateEchoShards(temporalEnergy);

    return {
      canShift,
      echoShards: es.toFixed(0),
      requirement: this.getShiftRequirement(),
    };
  }
}