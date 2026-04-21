import Decimal from 'break_infinity.js';
import { num } from '@/core/NumberManager';
import { GameLoop } from './GameLoop';
import { TemporalEnergy } from '@/game/currencies/TemporalEnergy';
import { EchoShards } from '@/game/currencies/EchoShards';
import { TimeCrystals } from '@/game/currencies/TimeCrystals';
import { RealityStrands } from '@/game/currencies/RealityStrands';
import { NexusFragments } from '@/game/currencies/NexusFragments';
import { CelestialOrbs } from '@/game/currencies/CelestialOrbs';
import { Generator } from '@/game/generators/Generator';
import { echoCollectors, temporalDimensions } from '@/data/generators';
import { ChronalerShift } from '@/game/prestige/ChronalerShift';
import { EpochalTranscendence } from '@/game/prestige/EpochalTranscendence';
import { RealityWeave } from '@/game/prestige/RealityWeave';
import { Nexus } from '@/game/prestige/Nexus';
import { CelestialAscension } from '@/game/prestige/CelestialAscension';

export class Game {
  private static instance: Game;

  private gameLoop: GameLoop;
  public temporalEnergy: TemporalEnergy;
  public echoShards: EchoShards;
  public timeCrystals: TimeCrystals;
  public realityStrands: RealityStrands;
  public nexusFragments: NexusFragments;
  public celestialOrbs: CelestialOrbs;
  public generators: Map<string, Generator> = new Map();
  public dimensions: Map<string, Generator> = new Map();
  public tickCount: number = 0;
  public chronalerShifts: number = 0;
  public epochalTranscensions: number = 0;
  public realityWeaves: number = 0;
  public nexusAscensions: number = 0;
  public celestialAscensions: number = 0;

  public currentTDT: number = 1;
  public bestTDT: number = 1;

  private constructor() {
    this.temporalEnergy = new TemporalEnergy();
    this.echoShards = new EchoShards();
    this.timeCrystals = new TimeCrystals();
    this.realityStrands = new RealityStrands();
    this.nexusFragments = new NexusFragments();
    this.celestialOrbs = new CelestialOrbs();
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
      if (['EC1', 'EC2', 'EC3', 'EC4'].includes(config.id)) {
        generator.isUnlocked = true;
      }
      this.generators.set(config.id, generator);
    }
    this.temporalEnergy.add(10);
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
    const td1 = this.dimensions.get('TD1');
    if (td1 && !td1.isUnlocked && this.chronalerShifts > 0) {
      td1.isUnlocked = true;
    }

    const tdThresholds: Record<string, { prev: string; count: number }> = {
      TD2: { prev: 'TD1', count: 5 },
      TD3: { prev: 'TD2', count: 5 },
      TD4: { prev: 'TD3', count: 5 },
      TD5: { prev: 'TD4', count: 5 },
      TD6: { prev: 'TD5', count: 5 },
      TD7: { prev: 'TD6', count: 5 },
      TD8: { prev: 'TD7', count: 5 },
    };

    for (const [id, req] of Object.entries(tdThresholds)) {
      const dimension = this.dimensions.get(id);
      if (!dimension || dimension.isUnlocked) continue;

      const prevDimension = this.dimensions.get(req.prev);
      if (prevDimension && prevDimension.count.gte(req.count)) {
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

    for (const dimension of this.dimensions.values()) {
      if (!dimension.isUnlocked || dimension.count.lte(0)) continue;

      const production = dimension.baseProduction.mul(dimension.count).mul(effectiveDelta);

      if (dimension.id === 'TD1') {
        this.timeCrystals.add(production);
      }
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

    this.temporalEnergy.subtract(cost);
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

  public canChronalerShift(): boolean {
    return ChronalerShift.getInstance().canShift(this.temporalEnergy.amount);
  }

  public getChronalerShiftReward(): Decimal {
    return ChronalerShift.getInstance().calculateEchoShards(this.temporalEnergy.amount);
  }

  public performChronalerShift(): Decimal {
    if (!this.canChronalerShift()) {
      return new Decimal(0);
    }

    const esGained = this.getChronalerShiftReward();
    this.echoShards.add(esGained);
    this.chronalerShifts++;

    ChronalerShift.getInstance().performShift();
    this.updateUnlocks();

    return esGained;
  }

  public getChronalerShiftInfo(): { canShift: boolean; echoShards: string } {
    const info = ChronalerShift.getInstance().getShiftInfo(this.temporalEnergy.amount);
    return {
      canShift: info.canShift,
      echoShards: info.echoShards,
    };
  }

  public canEpochalTranscendence(): boolean {
    return EpochalTranscendence.getInstance().canTranscend(this.timeCrystals.amount);
  }

  public getEpochalTranscendenceReward(): Decimal {
    return EpochalTranscendence.getInstance().calculateTimeCrystals(this.timeCrystals.amount);
  }

  public performEpochalTranscendence(): Decimal {
    if (!this.canEpochalTranscendence()) {
      return new Decimal(0);
    }

    const zkGained = this.getEpochalTranscendenceReward();
    this.timeCrystals.add(zkGained);
    this.epochalTranscensions++;

    EpochalTranscendence.getInstance().performTranscendence();
    this.updateUnlocks();

    return zkGained;
  }

  public getEpochalTranscendenceInfo(): { canTranscend: boolean; timeCrystals: string } {
    return EpochalTranscendence.getInstance().getTranscendenceInfo(this.timeCrystals.amount);
  }

  public canRealityWeave(): boolean {
    return RealityWeave.getInstance().canWeave(this.timeCrystals.amount);
  }

  public getRealityWeaveReward(): Decimal {
    return RealityWeave.getInstance().calculateRealityStrands(this.timeCrystals.amount);
  }

  public performRealityWeave(): Decimal {
    if (!this.canRealityWeave()) {
      return new Decimal(0);
    }

    const rsGained = this.getRealityWeaveReward();
    this.realityStrands.add(rsGained);
    this.realityWeaves++;

    RealityWeave.getInstance().performWeave();
    this.updateUnlocks();

    return rsGained;
  }

  public getRealityWeaveInfo(): { canWeave: boolean; strands: string } {
    const info = RealityWeave.getInstance().getWeaveInfo(this.timeCrystals.amount);
    return { canWeave: info.canWeave, strands: info.strands };
  }

  reset(): void {
    for (const generator of this.generators.values()) {
      generator.reset();
    }
    this.temporalEnergy.reset();
    this.tickCount = 0;
  }

  public canNexusAscend(): boolean {
    return Nexus.getInstance().canAscend(this.realityStrands.amount);
  }

  public getNexusAscendReward(): Decimal {
    return Nexus.getInstance().calculateNexusFragments(this.realityStrands.amount);
  }

  public performNexusAscend(): Decimal {
    if (!this.canNexusAscend()) return new Decimal(0);
    const nfGained = this.getNexusAscendReward();
    this.nexusFragments.add(nfGained);
    this.nexusAscensions++;
    Nexus.getInstance().performAscend();
    this.updateUnlocks();
    return nfGained;
  }

  public getNexusAscendInfo(): { canAscend: boolean; fragments: string } {
    const info = Nexus.getInstance().getAscendInfo(this.realityStrands.amount);
    return { canAscend: info.canAscend, fragments: info.fragments };
  }

  public canCelestialAscend(): boolean {
    return CelestialAscension.getInstance().canAscend(this.nexusFragments.amount);
  }

  public getCelestialAscendReward(): Decimal {
    return CelestialAscension.getInstance().calculateCelestialOrbs(this.nexusFragments.amount);
  }

  public performCelestialAscend(): Decimal {
    if (!this.canCelestialAscend()) return new Decimal(0);
    const hoGained = this.getCelestialAscendReward();
    this.celestialOrbs.add(hoGained);
    this.celestialAscensions++;
    CelestialAscension.getInstance().performAscend();
    this.updateUnlocks();
    return hoGained;
  }

  public getCelestialAscendInfo(): { canAscend: boolean; orbs: string } {
    const info = CelestialAscension.getInstance().getAscendInfo(this.nexusFragments.amount);
    return { canAscend: info.canAscend, orbs: info.orbs };
  }
}