import { IncomingDiscordPayload } from 'vulkava/lib/@types';
import { client } from '../../index';
import { lavalink } from '../../Utils/lavalink';

client.on('raw', (packet: IncomingDiscordPayload) =>
  lavalink.handleVoiceUpdate(packet)
);
