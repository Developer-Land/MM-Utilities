import { EventEmitter } from 'stream';
export class Event<Key extends string | symbol> {
  constructor(
    public emitter: EventEmitter,
    public event: Key,
    public run: (...args: any) => any
  ) {}
}
