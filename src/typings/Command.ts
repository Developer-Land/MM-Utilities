import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
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

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
}

type RunFunction = (options: RunOptions) => any;

interface ExtendedApplicationCommandSubCommandData
  extends ApplicationCommandSubCommandData {
  userPermissions: PermissionResolvable[];
}

type ExtendedApplicationCommandOptionData = ApplicationCommandOptionData & {
  ApplicationCommandSubCommandData: ExtendedApplicationCommandSubCommandData;
};
export interface ExtendedChatInputApplicationCommandData
  extends ChatInputApplicationCommandData {
  options?: ExtendedApplicationCommandOptionData[];
}

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  category?: string;
  subcommands?: string;
  run: RunFunction;
} & ExtendedChatInputApplicationCommandData;
