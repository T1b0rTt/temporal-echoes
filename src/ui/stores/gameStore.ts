import { defineStore } from 'pinia';
import { Decimal } from 'break_infinity.js';
import { num } from '@/core/NumberManager';
import { Game } from '@/core/Game';

interface GameState {
  temporalEnergy: Decimal;
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
    totalTEProduced: num.create(0),
    totalTEClicked: 0,
    totalPlayTime: 0,
    currentTDT: 0,
    bestTDT: 0,
    gameStarted: false,
  }),

  getters: {
    formattedTE(): string {
      return num.format(this.temporalEnergy, 1);
    },

    formattedTotalProduced(): string {
      return num.format(this.totalTEProduced, 1);
    },

    isPrestigeAvailable(): boolean {
      return this.temporalEnergy.gte(1e12);
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

    click(): void {
      this.addTE(1);
      this.totalTEClicked++;
    },

    tick(deltaTime: number): void {
      if (!this.gameStarted) return;
      this.totalPlayTime += deltaTime;
      Game.getInstance().processTick(deltaTime);
    },

    startGame(): void {
      this.gameStarted = true;
    },
  },
});