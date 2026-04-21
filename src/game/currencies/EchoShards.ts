import { Currency } from './Currency';

export class EchoShards extends Currency {
  constructor() {
    super({
      id: 'ES',
      name: 'Echo-Scherben',
      symbol: 'ES',
      description: 'Währung für permanente Upgrades nach einem Chronalen Shift.',
    });
  }
}