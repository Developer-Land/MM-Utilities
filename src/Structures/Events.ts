import { EventEmitter } from 'stream';

interface Event<T> {
  event: T;
  run: (...args: any) => any;
  options?: { once: boolean };
}

export class Events<T> {
  constructor(public emitter: EventEmitter, public events: [...Event<T>[]]) {}
}

//
