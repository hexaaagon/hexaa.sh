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

  once<K extends keyof T>(event: K, callback: (...args: T[K]) => void) {
    const wrappedCallback = (...args: T[K]) => {
      callback(...args);
      this.removeListener(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }

  emit<K extends keyof T>(event: K, ...args: T[K]) {
    if (this.events[event]) {
      this.events[event]?.forEach((callback) => callback(...args));
    }
  }

  removeListener<K extends keyof T>(
    event: K,
    callback: (...args: T[K]) => void,
  ) {
    if (this.events[event]) {
      this.events[event] = this.events[event]?.filter((cb) => cb !== callback);
    }
  }
}
