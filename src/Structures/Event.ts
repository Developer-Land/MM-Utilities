import { EventEmitter } from 'stream';

export class Event {
  constructor(
    public emitter: EventEmitter,
    public event: string | symbol,
    public run: (...args: any) => any,
    public options?: { once: boolean }
  ) {}
}
