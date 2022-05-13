import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  GuildMember,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  developersOnly?: boolean;
  category?: string;
  subcommands?: string[];
  options?: { userPermissions?: PermissionResolvable[] }[];
  init?: (client: ExtendedClient) => any;
  run: (client: ExtendedClient, interaction: ExtendedInteraction) => any;
} & ChatInputApplicationCommandData;
