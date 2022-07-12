import { EventEmitter } from 'stream';

interface Event {
  event: string | symbol;
  run: (...args: any) => any;
  options?: { once: boolean };
}

export class Events {
  constructor(public emitter: EventEmitter, public events: [...Event[]]) {}
}

//
