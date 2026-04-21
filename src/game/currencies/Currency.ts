import Decimal from 'break_infinity.js';
import { num } from '@/core/NumberManager';

export interface CurrencyConfig {
  id: string;
  name: string;
  symbol: string;
  description?: string;
}

export class Currency {
  public readonly id: string;
  public readonly name: string;
  public readonly symbol: string;
  public readonly description?: string;
  public amount: Decimal;

  constructor(config: CurrencyConfig) {
    this.id = config.id;
    this.name = config.name;
    this.symbol = config.symbol;
    this.description = config.description;
    this.amount = num.create(0);
  }

  add(value: Decimal | number | string): void {
    this.amount = this.amount.add(value);
  }

  subtract(value: Decimal | number | string): boolean {
    if (this.amount.lt(value)) return false;
    this.amount = this.amount.sub(value);
    return true;
  }

  canAfford(value: Decimal | number | string): boolean {
    return this.amount.gte(value);
  }

  reset(): void {
    this.amount = num.create(0);
  }

  format(decimals: number = 0): string {
    return num.format(this.amount, decimals);
  }
}