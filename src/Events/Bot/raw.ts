import { IncomingDiscordPayload } from 'vulkava/lib/@types';
import { client } from '../../index';
import { Event } from '../../Structures/Event';
import { lavalink } from '../../Systems/lavalink';

export default new Event<string>(
  client,
  'raw',
  async (payload: IncomingDiscordPayload) => {
    lavalink.handleVoiceUpdate(payload);
  }
);
