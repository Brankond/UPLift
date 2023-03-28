class Timer {
  private startTime: number;
  private duration: number;
  private timeoutId: ReturnType<typeof setTimeout> | null;
  private onTimeout: () => void;

  constructor(duration: number, onTimeout: () => void) {
    this.startTime = 0;
    this.duration = duration;
    this.timeoutId = null;
    this.onTimeout = onTimeout;
  }

  start(): void {
    this.startTime = Date.now();
    this.timeoutId = setTimeout(() => {
      this.onTimeout();
      this.timeoutId = null;
    }, this.duration);
  }

  stop(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  getRemainingTime(): number {
    if (this.timeoutId === null) {
      return 0;
    }
    const currentTime = Date.now();
    return Math.max(0, this.startTime + this.duration - currentTime);
  }
}

export default Timer;
