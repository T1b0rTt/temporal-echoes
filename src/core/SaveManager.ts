import { Game } from './Game';
import { UpgradeManager } from '@/game/upgrades/UpgradeManager';

const SAVE_KEY = 'temporal-echoes-save';
const AUTO_SAVE_INTERVAL = 30000;

interface SaveData {
  version: string;
  timestamp: number;
  temporalEnergy: string;
  generators: Record<string, number>;
  dimensions: Record<string, number>;
  upgrades: Record<string, number>;
  currentTDT: number;
  bestTDT: number;
  totalTEClicked: number;
  totalPlayTime: number;
}

export class SaveManager {
  private static instance: SaveManager;
  private autoSaveInterval: number | null = null;
  private db: IDBDatabase | null = null;

  private constructor() {}

  static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TemporalEchoes', 1);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('saves')) {
          db.createObjectStore('saves', { keyPath: 'key' });
        }
      };
    });
  }

  async save(): Promise<void> {
    const game = Game.getInstance();
    const upgradeManager = UpgradeManager.getInstance();

    const saveData: SaveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      temporalEnergy: game.temporalEnergy.amount.toString(),
      generators: this.serializeGenerators(game.getAllGenerators()),
      dimensions: this.serializeGenerators(game.getAllDimensions()),
      upgrades: upgradeManager.save(),
      currentTDT: game.currentTDT,
      bestTDT: game.bestTDT,
      totalTEClicked: 0,
      totalPlayTime: 0,
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['saves'], 'readwrite');
      const store = transaction.objectStore('saves');
      const request = store.put({ key: SAVE_KEY, data: saveData });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['saves'], 'readonly');
      const store = transaction.objectStore('saves');
      const request = store.get(SAVE_KEY);

      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(false);
          return;
        }

        this.applySaveData(result.data);
        resolve(true);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private serializeGenerators(generators: any[]): Record<string, number> {
    const data: Record<string, number> = {};
    for (const gen of generators) {
      data[gen.id] = gen.count.toNumber();
    }
    return data;
  }

  private applySaveData(data: SaveData): void {
    const game = Game.getInstance();
    const upgradeManager = UpgradeManager.getInstance();

    if (data.temporalEnergy) {
      game.temporalEnergy.amount = game.temporalEnergy.amount.add(data.temporalEnergy);
    }

    if (data.generators) {
      for (const [id, count] of Object.entries(data.generators)) {
        const generator = game.getGenerator(id);
        if (generator) {
          generator.count = generator.count.add(count);
        }
      }
    }

    if (data.upgrades) {
      upgradeManager.load(data.upgrades);
    }

    if (data.currentTDT) {
      game.currentTDT = data.currentTDT;
    }

    if (data.bestTDT) {
      game.bestTDT = data.bestTDT;
    }
  }

  async calculateOfflineProgress(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['saves'], 'readonly');
      const store = transaction.objectStore('saves');
      const request = store.get(SAVE_KEY);

      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(0);
          return;
        }

        const offlineTime = (Date.now() - result.data.timestamp) / 1000;
        resolve(Math.min(offlineTime, 86400));
      };

      request.onerror = () => reject(request.error);
    });
  }

  startAutoSave(): void {
    if (this.autoSaveInterval) {
      return;
    }

    this.autoSaveInterval = window.setInterval(() => {
      this.save().catch(console.error);
    }, AUTO_SAVE_INTERVAL);
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      window.clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  async deleteSave(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['saves'], 'readwrite');
      const store = transaction.objectStore('saves');
      const request = store.delete(SAVE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  exportToLocalStorage(): string {
    const game = Game.getInstance();
    const upgradeManager = UpgradeManager.getInstance();

    const saveData: SaveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      temporalEnergy: game.temporalEnergy.amount.toString(),
      generators: this.serializeGenerators(game.getAllGenerators()),
      dimensions: this.serializeGenerators(game.getAllDimensions()),
      upgrades: upgradeManager.save(),
      currentTDT: game.currentTDT,
      bestTDT: game.bestTDT,
      totalTEClicked: 0,
      totalPlayTime: 0,
    };

    return btoa(JSON.stringify(saveData));
  }

  importFromLocalStorage(saveString: string): boolean {
    try {
      const saveData = JSON.parse(atob(saveString)) as SaveData;
      this.applySaveData(saveData);
      return true;
    } catch (e) {
      console.error('Failed to import save:', e);
      return false;
    }
  }
}