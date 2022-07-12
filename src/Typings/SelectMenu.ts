import {
  GuildMember,
  PermissionResolvable,
  SelectMenuInteraction,
} from 'discord.js';
import { ExtendedClient } from '../Structures/Client';

export interface ExtendedSelectMenuInteraction extends SelectMenuInteraction {
  member: GuildMember;
}

export type SelectMenuType = {
  customId: string;
  userPermissions?: PermissionResolvable[];
  run: (
    client: ExtendedClient,
    interaction: ExtendedSelectMenuInteraction
  ) => any;
};
