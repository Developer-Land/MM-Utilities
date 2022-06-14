import { VoiceState } from 'discord.js';
import { client } from '../../index';
import { Event } from '../../structures/Event';
import { lavalink } from '../../utils/lavalink';

export default new Event(
  client,
  'voiceStateUpdate',
  async (oldState: VoiceState | null, newState: VoiceState) => {
    if (newState.member.user.id === client.user.id) {
      let player = lavalink.players.get(newState.guild.id);
      if (oldState.channelId && !newState.channelId && player) {
        player.destroy();
      }
    }
  }
);
