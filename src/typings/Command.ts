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
export interface ExtendedCommandInteraction extends CommandInteraction {
  member: GuildMember;
}

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  developersOnly?: boolean;
  category?: string;
  subcommands?: string[];
  init?: (client: ExtendedClient) => any;
  run: (client: ExtendedClient, interaction: ExtendedCommandInteraction) => any;
} & ChatInputApplicationCommandData;
