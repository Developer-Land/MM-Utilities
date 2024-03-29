import {
  AutocompleteInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../Structures/Client';

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export interface ExtendedCommandInteraction
  extends ChatInputCommandInteraction {
  member: GuildMember;
}

export interface ExtendedAutocompleteInteraction
  extends AutocompleteInteraction {
  member: GuildMember;
}

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  developersOnly?: boolean;
  category?: string;
  subcommands?: string[];
  init?: (client: ExtendedClient) => any;
  run: (client: ExtendedClient, interaction: ExtendedCommandInteraction) => any;
  autocomplete?: (
    client: ExtendedClient,
    interaction: ExtendedAutocompleteInteraction
  ) => any;
} & ChatInputApplicationCommandData;
