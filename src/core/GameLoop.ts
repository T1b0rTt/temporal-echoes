export const GAME_TPS = 30;
export const TICK_INTERVAL = 1000 / GAME_TPS;

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private running: boolean = false;
  private animationFrameId: number | null = null;
  private onTick: (deltaTime: number) => void;

  constructor(onTick: (deltaTime: number) => void) {
    this.onTick = onTick;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (): void => {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.accumulator += deltaTime;

    while (this.accumulator >= TICK_INTERVAL) {
      this.onTick(TICK_INTERVAL / 1000);
      this.accumulator -= TICK_INTERVAL;
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}