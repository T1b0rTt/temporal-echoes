import { Decimal } from 'break_infinity.js';
import { Game } from '@/core/Game';

export interface SequencerCommand {
  type: 'buy' | 'wait' | 'waitFor' | 'prestige' | 'shift' | 'loop' | 'if' | 'label' | 'goto' | 'stop';
  target?: string;
  amount?: number;
  condition?: string;
  value?: number;
  label?: string;
}

export interface SequencerLine {
  lineNumber: number;
  command: SequencerCommand;
  raw: string;
}

export class Sequencer {
  private static instance: Sequencer;
  private commands: SequencerLine[] = [];
  private currentLine: number = 0;
  private isRunning: boolean = false;
  private ticksWaited: number = 0;
  private variables: Map<string, number> = new Map();
  private loopStart: number = -1;
  private loopCount: number = 0;
  private maxLoops: number = 1000;

  private constructor() {}

  static getInstance(): Sequencer {
    if (!Sequencer.instance) {
      Sequencer.instance = new Sequencer();
    }
    return Sequencer.instance;
  }

  public parseScript(script: string): SequencerLine[] {
    const lines = script.split('\n');
    const commands: SequencerLine[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#') || line.startsWith('//')) {
        continue;
      }

      const parsed = this.parseLine(line, i + 1);
      if (parsed) {
        commands.push(parsed);
      }
    }

    return commands;
  }

  private parseLine(line: string, lineNumber: number): SequencerLine | null {
    const parts = line.split(/\s+/);
    const cmd = parts[0]?.toLowerCase();

    switch (cmd) {
      case 'buy':
        return {
          lineNumber,
          command: { type: 'buy', target: parts[1]?.toUpperCase(), amount: parseInt(parts[2]) || 1 },
          raw: line
        };
      case 'wait':
        return {
          lineNumber,
          command: { type: 'wait', amount: parseInt(parts[1]) || 1 },
          raw: line
        };
      case 'waitfor':
        return {
          lineNumber,
          command: { type: 'waitFor', condition: parts[1], value: parseFloat(parts[2]) || 0 },
          raw: line
        };
      case 'prestige':
      case 'shift':
        return {
          lineNumber,
          command: { type: 'prestige' },
          raw: line
        };
      case 'dimension':
        return {
          lineNumber,
          command: { type: 'shift', target: 'dimension' },
          raw: line
        };
      case 'chronal':
        return {
          lineNumber,
          command: { type: 'shift', target: 'chronal' },
          raw: line
        };
      case 'epochal':
        return {
          lineNumber,
          command: { type: 'shift', target: 'epochal' },
          raw: line
        };
      case 'loop':
        return {
          lineNumber,
          command: { type: 'loop', amount: parseInt(parts[1]) || 10 },
          raw: line
        };
      case 'label':
        return {
          lineNumber,
          command: { type: 'label', label: parts[1] },
          raw: line
        };
      case 'goto':
        return {
          lineNumber,
          command: { type: 'goto', label: parts[1] },
          raw: line
        };
      case 'stop':
        return {
          lineNumber,
          command: { type: 'stop' },
          raw: line
        };
      default:
        return null;
    }
  }

  public loadScript(script: string): boolean {
    try {
      this.commands = this.parseScript(script);
      return this.commands.length > 0;
    } catch (e) {
      console.error('Script parse error:', e);
      return false;
    }
  }

  public start(): void {
    if (this.commands.length === 0) return;
    this.isRunning = true;
    this.currentLine = 0;
    this.ticksWaited = 0;
    this.loopCount = 0;
  }

  public stop(): void {
    this.isRunning = false;
    this.currentLine = 0;
    this.ticksWaited = 0;
  }

  public pause(): void {
    this.isRunning = false;
  }

  public resume(): void {
    if (this.commands.length > 0) {
      this.isRunning = true;
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public getCurrentLine(): number {
    return this.currentLine;
  }

  public getTotalLines(): number {
    return this.commands.length;
  }

  public tick(): void {
    if (!this.isRunning || this.commands.length === 0) return;

    if (this.currentLine >= this.commands.length) {
      this.stop();
      return;
    }

    const line = this.commands[this.currentLine];
    const result = this.executeCommand(line.command);

    if (result === 'wait') {
      this.ticksWaited++;
    } else if (result === 'next') {
      this.currentLine++;
      this.ticksWaited = 0;
    } else if (result === 'restart') {
      this.currentLine = 0;
      this.loopCount = 0;
    } else if (typeof result === 'number') {
      this.currentLine = result;
    }
  }

  private executeCommand(cmd: SequencerCommand): string | number {
    const game = Game.getInstance();

    switch (cmd.type) {
      case 'buy': {
        if (!cmd.target) return 'next';
        const generator = game.getGenerator(cmd.target);
        if (generator && generator.isUnlocked) {
          const cost = generator.cost.mul(cmd.amount || 1);
          if (game.temporalEnergy.amount.gte(cost)) {
            game.buyGenerator(cmd.target, game.temporalEnergy.amount);
          }
        }
        return 'next';
      }
      case 'wait': {
        const waitTime = (cmd.amount || 1) * 30;
        if (this.ticksWaited >= waitTime) {
          return 'next';
        }
        return 'wait';
      }
      case 'waitFor': {
        const te = game.temporalEnergy.amount.toNumber();
        if (cmd.condition === '>=' && te >= (cmd.value || 0)) {
          return 'next';
        }
        if (cmd.condition === '<=' && te <= (cmd.value || 0)) {
          return 'next';
        }
        if (cmd.condition === '>' && te > (cmd.value || 0)) {
          return 'next';
        }
        if (cmd.condition === '<' && te < (cmd.value || 0)) {
          return 'next';
        }
        return 'wait';
      }
      case 'prestige':
      case 'shift': {
        if (cmd.target === 'dimension') {
          if (game.canDoDimensionShift()) {
            game.doDimensionShift();
          }
        } else if (cmd.target === 'chronal') {
          if (game.canChronalerShift()) {
            game.performChronalerShift();
          }
        } else if (cmd.target === 'epochal') {
          if (game.canEpochalTranscendence()) {
            game.performEpochalTranscendence();
          }
        }
        return 'next';
      }
      case 'loop': {
        this.loopCount++;
        if (this.loopCount < (cmd.amount || 10)) {
          this.currentLine = this.loopStart >= 0 ? this.loopStart : 0;
          this.loopCount = 0;
        } else {
          this.loopCount = 0;
          this.loopStart = -1;
          this.currentLine++;
        }
        return 'next';
      }
      case 'label':
        this.currentLine++;
        return 'next';
      case 'goto': {
        const targetLine = this.commands.findIndex(
          c => c.command.type === 'label' && c.command.label === cmd.label
        );
        if (targetLine >= 0) {
          return targetLine + 1;
        }
        return 'next';
      }
      case 'stop':
        this.stop();
        return 'next';
      default:
        return 'next';
    }
  }

  public reset(): void {
    this.commands = [];
    this.currentLine = 0;
    this.isRunning = false;
    this.ticksWaited = 0;
    this.variables.clear();
  }
}