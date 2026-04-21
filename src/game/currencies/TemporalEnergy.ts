import { Currency } from './Currency';

export class TemporalEnergy extends Currency {
  constructor() {
    super({
      id: 'TE',
      name: 'Temporale Energie',
      symbol: 'TE',
      description: 'Die grundlegende Ressource des Spiels.',
    });
  }
}