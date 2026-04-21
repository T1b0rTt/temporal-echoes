import { Currency } from './Currency';

export class RealityStrands extends Currency {
  constructor() {
    super({
      id: 'RS',
      name: 'Realitätsstränge',
      symbol: 'RS',
      description: 'Währung für die dritte Prestige-Ebene.',
    });
  }
}