import { Currency } from './Currency';

export class CelestialOrbs extends Currency {
  constructor() {
    super({
      id: 'HO',
      name: 'Himmlische Orbs',
      symbol: 'HO',
      description: 'Die ultimative Währung für die finale Prestige-Ebene.',
    });
  }
}