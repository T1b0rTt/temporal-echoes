import { defineStore } from 'pinia';
import Decimal from 'break_infinity.js';
import { num } from '@/core/NumberManager';
import { Game } from '@/core/Game';
import { SaveManager } from '@/core/SaveManager';

interface GameState {
  temporalEnergy: Decimal;
  echoShards: Decimal;
  timeCrystals: Decimal;
  realityStrands: Decimal;
  totalTEProduced: Decimal;
  totalTEClicked: number;
  totalPlayTime: number;
  currentTDT: number;
  bestTDT: number;
  gameStarted: boolean;
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    temporalEnergy: num.create(0),
    echoShards: num.create(0),
    timeCrystals: num.create(0),
    realityStrands: num.create(0),
    totalTEProduced: num.create(0),
    totalTEClicked: 0,
    totalPlayTime: 0,
    currentTDT: 1,
    bestTDT: 1,
    gameStarted: false,
  }),

  getters: {
    formattedTE(): string {
      return num.format(this.temporalEnergy, 1);
    },

    formattedES(): string {
      return num.format(this.echoShards, 0);
    },

    formattedZK(): string {
      return num.format(this.timeCrystals, 0);
    },

    formattedRS(): string {
      return num.format(this.realityStrands, 0);
    },

    formattedTotalProduced(): string {
      return num.format(this.totalTEProduced, 1);
    },

    isPrestigeAvailable(): boolean {
      return this.temporalEnergy.gte(1e12);
    },

    isDimensionShiftAvailable(): boolean {
      return this.temporalEnergy.gte(1e6);
    },

    formattedTDT(): string {
      return this.currentTDT.toFixed(2);
    },
  },

  actions: {
    addTE(amount: Decimal | number): void {
      this.temporalEnergy = this.temporalEnergy.add(amount);
      this.totalTEProduced = this.totalTEProduced.add(amount);
    },

    spendTE(amount: Decimal | number): boolean {
      if (this.temporalEnergy.lt(amount)) return false;
      this.temporalEnergy = this.temporalEnergy.sub(amount);
      return true;
    },

    addEchoShards(amount: Decimal | number): void {
      this.echoShards = this.echoShards.add(amount);
    },

    addTimeCrystals(amount: Decimal | number): void {
      this.timeCrystals = this.timeCrystals.add(amount);
    },

    addRealityStrands(amount: Decimal | number): void {
      this.realityStrands = this.realityStrands.add(amount);
    },

    spendEchoShards(amount: Decimal | number): boolean {
      if (this.echoShards.lt(amount)) return false;
      this.echoShards = this.echoShards.sub(amount);
      return true;
    },

    click(): void {
      this.addTE(1);
      this.totalTEClicked++;
    },

    tick(deltaTime: number): void {
      if (!this.gameStarted) return;
      this.totalPlayTime += deltaTime;

      const game = Game.getInstance();
      game.processTick(deltaTime);
      this.temporalEnergy = game.temporalEnergy.amount;
      this.timeCrystals = game.timeCrystals.amount;
      this.realityStrands = game.realityStrands.amount;
      this.currentTDT = game.currentTDT;
    },

    async doDimensionShift(): Promise<void> {
      const game = Game.getInstance();
      if (!game.canDoDimensionShift()) return;

      const esGained = game.doDimensionShift();
      if (esGained.gt(0)) {
        this.addEchoShards(esGained);
      }

      this.temporalEnergy = game.temporalEnergy.amount;
      this.currentTDT = game.currentTDT;
      this.bestTDT = game.bestTDT;
    },

    async doChronalerShift(): Promise<void> {
      const game = Game.getInstance();
      if (!game.canChronalerShift()) return;

      const esGained = game.performChronalerShift();
      if (esGained.gt(0)) {
        this.addEchoShards(esGained);
      }
    },

    async doEpochalTranscendence(): Promise<void> {
      const game = Game.getInstance();
      if (!game.canEpochalTranscendence()) return;

      const zkGained = game.performEpochalTranscendence();
      if (zkGained.gt(0)) {
        this.addTimeCrystals(zkGained);
      }
    },

    async doRealityWeave(): Promise<void> {
      const game = Game.getInstance();
      if (!game.canRealityWeave()) return;

      const rsGained = game.performRealityWeave();
      if (rsGained.gt(0)) {
        this.addRealityStrands(rsGained);
      }
    },

    async saveGame(): Promise<void> {
      const saveManager = SaveManager.getInstance();
      await saveManager.save();
    },

    async loadGame(): Promise<boolean> {
      const saveManager = SaveManager.getInstance();
      return await saveManager.load();
    },

    startGame(): void {
      this.gameStarted = true;
      const saveManager = SaveManager.getInstance();
      saveManager.startAutoSave();
    },
  },
});