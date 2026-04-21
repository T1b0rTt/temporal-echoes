import { Decimal } from 'break_infinity.js';

export class NumberManager {
  private static instance: NumberManager;

  static getInstance(): NumberManager {
    if (!NumberManager.instance) {
      NumberManager.instance = new NumberManager();
    }
    return NumberManager.instance;
  }

  create(value: number | string | Decimal = 0): Decimal {
    return new Decimal(value);
  }

  add(a: Decimal, b: Decimal | number | string): Decimal {
    return a.add(b);
  }

  multiply(a: Decimal, b: Decimal | number | string): Decimal {
    return a.mul(b);
  }

  divide(a: Decimal, b: Decimal | number | string): Decimal {
    return a.div(b);
  }

  pow(base: Decimal, exponent: Decimal | number): Decimal {
    return base.pow(exponent);
  }

  log10(value: Decimal): Decimal {
    return value.log10();
  }

  floor(value: Decimal): Decimal {
    return value.floor();
  }

  sqrt(value: Decimal): Decimal {
    return value.sqrt();
  }

  min(a: Decimal, b: Decimal): Decimal {
    return a.lt(b) ? a : b;
  }

  max(a: Decimal, b: Decimal): Decimal {
    return a.gt(b) ? a : b;
  }

  format(value: Decimal, decimals: number = 0): string {
    if (value.lt(1000)) {
      return value.toNumber().toFixed(decimals);
    }

    const log10 = value.log10().toNumber();
    const mantissa = value.div(Math.pow(10, Math.floor(log10))).toNumber();

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const suffixIndex = Math.floor(log10 / 3);

    if (suffixIndex < suffixes.length) {
      return `${mantissa.toFixed(2)}${suffixes[suffixIndex]}`;
    }

    const scientific = log10.toExponential(2);
    return scientific.replace('+', '');
  }
}

export const num = NumberManager.getInstance();