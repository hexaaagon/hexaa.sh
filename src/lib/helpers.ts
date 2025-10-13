// had to rewrite the eventemitter class because of browser compatibility
export class EventEmitter<
  T extends Record<string, any[]> = Record<string, any[]>,
> {
  private events: { [K in keyof T]?: ((...args: T[K]) => void)[] } = {};

  on<K extends keyof T>(event: K, callback: (...args: T[K]) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]?.push(callback);
  }

  emit<K extends keyof T>(event: K, ...args: T[K]) {
    if (this.events[event]) {
      this.events[event]?.forEach((callback) => callback(...args));
    }
  }

  removeAllListeners<K extends keyof T>(event?: K) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}
