import { DefaultQueue, Track, UnresolvedTrack } from 'vulkava';

export class Queue extends DefaultQueue {
  constructor() {
    super();
  }

  public addToBeginning(track: Track | UnresolvedTrack) {
    this.tracks.unshift(track);
  }

  /**
   * Removes tracks from queue and returns the removed tracks.
   * @param start The location in the queue from which to start removing tracks.
   * @param deleteCount The number of tracks to remove.
   * @returns An array containing the tracks that were removed.
   */
  public remove(start: number, deleteCount?: number) {
    return this.tracks.splice(start - 1, deleteCount);
  }

  public slice(start: number, end?: number) {
    return this.tracks.slice(start, end);
  }
}
