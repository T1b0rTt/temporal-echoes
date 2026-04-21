import { Currency } from './Currency';

export class NexusFragments extends Currency {
  constructor() {
    super({
      id: 'NF',
      name: 'Nexus-Fragmente',
      symbol: 'NF',
      description: 'Währung für das Glyphen-System.',
    });
  }
}