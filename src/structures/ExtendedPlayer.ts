import { Player, Track, Vulkava } from 'vulkava';
import { PlayerOptions } from 'vulkava/lib/@types';

export class ExtendedPlayer extends Player {
  isAutoplay: boolean;
  previousTrack: Track;
  constructor(vulkava: Vulkava, options: PlayerOptions) {
    super(vulkava, options);
  }

  setAutoplay(toggle: boolean) {
    this.isAutoplay = toggle;
  }
  setPreviousTrack(track: Track) {
    this.previousTrack = track;
  }
  async autoplay(vulkava: Vulkava) {
    if (!this.isAutoplay) return;
    if (this.queue.size !== 0) return;
    if (!this.previousTrack) return;
    let search = await vulkava.search(
      `https://www.youtube.com/watch?v=${this.previousTrack.identifier}&list=RD${this.previousTrack.identifier}`
    );
    if (search.loadType === 'LOAD_FAILED' || search.loadType === 'NO_MATCHES')
      return;
    let track =
      search.tracks[
        Math.floor(Math.random() * Math.floor(search.tracks.length))
      ];
    track.setRequester('Autoplay');
    this.queue.add(track);
  }
}
