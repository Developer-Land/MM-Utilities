import { EventEmitter } from 'stream';

export class Event<T> {
  constructor(
    public emitter: EventEmitter,
    public event: T,
    public run: (...args: any) => any,
    public options?: { once: boolean }
  ) {}
}
