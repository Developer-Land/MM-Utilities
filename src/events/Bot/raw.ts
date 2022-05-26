import { IncomingDiscordPayload } from 'vulkava/lib/@types';
import { client } from '../../index';
import { Event } from '../../structures/Event';
import { lavalink } from '../../Utils/lavalink';

export default new Event(
  client,
  'raw',
  async (payload: IncomingDiscordPayload) => {
    lavalink.handleVoiceUpdate(payload);
  }
);
