import { Generator, GeneratorConfig } from './Generator';
import { echoCollectors } from '@/data/generators';

export class EchoCollectorManager {
  public generators: Map<string, Generator> = new Map();

  constructor() {
    this.initGenerators();
  }

  private initGenerators(): void {
    for (const config of echoCollectors) {
      const generator = new Generator(config);
      this.generators.set(config.id, generator);
    }
  }

  getGenerator(id: string): Generator | undefined {
    return this.generators.get(id);
  }

  getAllGenerators(): Generator[] {
    return Array.from(this.generators.values());
  }

  getUnlockedGenerators(): Generator[] {
    return this.getAllGenerators().filter(g => g.isUnlocked);
  }

  updateUnlocks(): void {
    for (const generator of this.generators.values()) {
      if (!generator.isUnlocked && generator.canUnlock()) {
        generator.isUnlocked = true;
      }
    }
  }

  getTotalProduction(produces: string): import('break_infinity.js').Decimal {
    let total = import('break_infinity.js').Decimal(0);
    for (const generator of this.generators.values()) {
      if (generator.produces === produces) {
        total = total.add(generator.production);
      }
    }
    return total;
  }

  reset(): void {
    for (const generator of this.generators.values()) {
      generator.reset();
    }
  }
}