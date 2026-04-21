import { Currency } from './Currency';

export class TimeCrystals extends Currency {
  constructor() {
    super({
      id: 'ZK',
      name: 'Zeitkristalle',
      symbol: 'ZK',
      description: 'Währung für die zweite Prestige-Ebene.',
    });
  }
}