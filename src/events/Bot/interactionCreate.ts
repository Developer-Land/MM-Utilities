import {
  ButtonInteraction,
  ColorResolvable,
  GuildMember,
  GuildMemberRoleManager,
  GuildTextBasedChannel,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  PermissionResolvable,
  Permissions,
  TextChannel,
} from 'discord.js';
import { client } from '../../index';
import { Event } from '../../structures/Event';
import { ExtendedInteraction } from '../../typings/Command';
import { Ticket } from '../../models/ticket/ticket';
import { createTranscript } from 'discord-html-transcripts';
const cooldownOfStaffList = new Set();
const { DeveloperIDs } = client.config;

export default new Event(
  client,
  'interactionCreate',
  async (interaction: Interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply('You have used a non existent command');

      // Developer Only Commands
      if (command.developersOnly) {
        if (!DeveloperIDs.includes(interaction.user.id)) {
          let developersOnly_embed = new MessageEmbed()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
              `Developers: ${DeveloperIDs.map((v) => `<@${v}>`).join(', ')}`
            )
            .setColor(client.config.botColor)
            .setFooter({
              text: `${client.user.tag}`,
              iconURL: `${client.user.displayAvatarURL({
                size: 4096,
                dynamic: true,
              })}`,
            })
            .setTimestamp();
          return interaction.reply({
            embeds: [developersOnly_embed],
            ephemeral: true,
          });
        }
      }

      // User Permissions
      let perms: PermissionResolvable;
      let MissingPermissionsArray: PermissionResolvable[];
      if (command.userPermissions?.length) {
        MissingPermissionsArray = [];
        for (perms of command.userPermissions) {
          if (
            !(interaction.member.permissions as Readonly<Permissions>).has(
              perms
            ) ||
            !(interaction.channel as GuildTextBasedChannel)
              .permissionsFor((interaction as ExtendedInteraction).member)
              .has(perms)
          ) {
            MissingPermissionsArray.push(perms);
          }
        }
      }
      for (let i = 0; i < command.options?.length; i++) {
        if (
          command.options[i].userPermissions?.length &&
          (interaction.options?.getSubcommand(false) ===
            command.options[i].name ||
            interaction.options?.getSubcommandGroup(false) ===
              command.options[i].name)
        ) {
          if (!MissingPermissionsArray) {
            MissingPermissionsArray = [];
          }
          for (perms of command.options[i].userPermissions) {
            if (
              !(interaction.member.permissions as Readonly<Permissions>).has(
                perms
              ) ||
              !(interaction.channel as GuildTextBasedChannel)
                .permissionsFor((interaction as ExtendedInteraction).member)
                .has(perms)
            ) {
              MissingPermissionsArray.push(perms);
            }
          }
        }
      }
      if (MissingPermissionsArray?.length) {
        const MissingPermissionsEmbed = new MessageEmbed()
          .setColor(client.config.errColor as ColorResolvable)
          .setDescription(
            ` You're missing the following permission(s): \n\`${MissingPermissionsArray.map(
              (x) => x
            ).join(', ')}\``
          );
        interaction.reply({
          embeds: [MissingPermissionsEmbed],
          ephemeral: true,
        });
        return;
      }

      command.run(client, interaction as ExtendedInteraction).catch((error) => {
        interaction.reply({
          content: 'An error has occured, tell a developer',
          ephemeral: true,
        });
        console.log(error);
        console.log(error.code || `no code`);
        const channel = client.channels.cache.get(
          '931459849097719808'
        ) as GuildTextBasedChannel;
        channel.send(
          `\`\`\`yaml\nerror -> ${error} \n\nGuild -> ${
            interaction.guild.name
          } \n\nInteraction Author -> ${interaction.user.id} || ${
            interaction.user.username
          } \n\nInteraction Name -> ${
            interaction.commandName
          } \n\nInteraction Options -> ${
            interaction.options?.data.length === 0
              ? 'No options provided'
              : interaction.options?.data
                  .map((x) =>
                    x.type === 'SUB_COMMAND_GROUP'
                      ? x.name +
                        ' ' +
                        x.options.map(
                          (y) =>
                            y.name +
                            ' ' +
                            y.options
                              .map((z) => z.name + ': ' + z.value)
                              .join(', ')
                        )
                      : x.type === 'SUB_COMMAND'
                      ? x.name +
                        ' ' +
                        x.options.map((y) => y.name + ': ' + y.value).join(', ')
                      : x.name + ': ' + x.value
                  )
                  .join(', ')
          } \n\nerror code -> ${error.code || 'No code'}\`\`\``
        );
      });
    }
    // Buttons/Menu Handling
    if (interaction.isButton()) {
      ///buttonroles///
      const customIds = interaction.customId.split(' ');
      const roles = customIds.map((x) => x.replace(/a|r|t/g, ''));

      const reply = (replyMessage: string) => {
        interaction.reply({
          content: replyMessage,
          ephemeral: true,
        });
      };

      //add type
      if (
        interaction.customId === roles[0] + 'a' ||
        interaction.customId === `${roles[0]}a ${roles[1]}a` ||
        interaction.customId === `${roles[0]}a ${roles[1]}a ${roles[2]}a` ||
        interaction.customId ===
          `${roles[0]}a ${roles[1]}a ${roles[2]}a ${roles[3]}a` ||
        interaction.customId ===
          `${roles[0]}a ${roles[1]}a ${roles[2]}a ${roles[3]}a ${roles[4]}a`
      ) {
        const changes = [];
        let editEmbed = interaction.message.embeds[0];
        let RoleName;
        roles.forEach((r, i) => {
          if (
            !(interaction.member.roles as GuildMemberRoleManager).cache.has(r)
          ) {
            (interaction.member.roles as GuildMemberRoleManager).add(r);
            changes.push('<:plus:930205440728510465> <@&' + r + '>');
            RoleName = interaction.guild.roles.cache.get(r).name;
            editEmbed.fields[0] = {
              name: `${RoleName} Members`,
              value: `${
                interaction.guild.members.cache.filter((member) =>
                  member.roles.cache.has(r)
                ).size
              }/${
                interaction.guild.members.cache.filter(
                  (member) => !member.user.bot
                ).size
              }`,
              inline: false,
            };
          }
        });
        if (!changes.length) reply('No role changes were made!');
        else {
          reply(`Roles updated!\n${changes.join('\n')}`);
          (interaction.message as Message).edit({ embeds: [editEmbed] });
        }
        return;
      }

      //remove type
      if (
        interaction.customId === roles[0] + 'r' ||
        interaction.customId === `${roles[0]}r ${roles[1]}r` ||
        interaction.customId === `${roles[0]}r ${roles[1]}r ${roles[2]}r` ||
        interaction.customId ===
          `${roles[0]}r ${roles[1]}r ${roles[2]}r ${roles[3]}r` ||
        interaction.customId ===
          `${roles[0]}r ${roles[1]}r ${roles[2]}r ${roles[3]}r ${roles[4]}r`
      ) {
        const changes = [];
        let editEmbed = interaction.message.embeds[0];
        let RoleName;
        roles.forEach((r) => {
          if (
            (interaction.member.roles as GuildMemberRoleManager).cache.has(r)
          ) {
            (interaction.member.roles as GuildMemberRoleManager).remove(r);
            changes.push('<:minus:930205412597301281> <@&' + r + '>');
            RoleName = interaction.guild.roles.cache.get(r).name;
            editEmbed.fields[0] = {
              name: `${RoleName} Members`,
              value: `${
                interaction.guild.members.cache.filter((member) =>
                  member.roles.cache.has(r)
                ).size
              }/${
                interaction.guild.members.cache.filter(
                  (member) => !member.user.bot
                ).size
              }`,
              inline: false,
            };
          }
        });
        if (!changes.length) reply('No role changes were made!');
        else {
          reply(`Roles updated!\n${changes.join('\n')}`);
          (interaction.message as Message).edit({ embeds: [editEmbed] });
        }
        return;
      }

      //toggle type
      if (
        interaction.customId === roles[0] + 't' ||
        interaction.customId === `${roles[0]}t ${roles[1]}t` ||
        interaction.customId === `${roles[0]}t ${roles[1]}t ${roles[2]}t` ||
        interaction.customId ===
          `${roles[0]}t ${roles[1]}t ${roles[2]}t ${roles[3]}t` ||
        interaction.customId ===
          `${roles[0]}t ${roles[1]}t ${roles[2]}t ${roles[3]}t ${roles[4]}t`
      ) {
        const changes = [];
        if (
          !(interaction.member.roles as GuildMemberRoleManager).cache.has(
            roles[0]
          )
        ) {
          roles.forEach((r) => {
            if (
              !(interaction.member.roles as GuildMemberRoleManager).cache.has(r)
            ) {
              (interaction.member.roles as GuildMemberRoleManager).add(r);
              changes.push('<:plus:930205440728510465> <@&' + r + '>');
            }
          });
        }
        if (!changes.length) {
          roles.forEach((r) => {
            if (
              (interaction.member.roles as GuildMemberRoleManager).cache.has(r)
            ) {
              (interaction.member.roles as GuildMemberRoleManager).remove(r);
              changes.push('<:minus:930205412597301281> <@&' + r + '>');
            }
          });
        }
        return reply(`Roles updated!\n${changes.join('\n')}`);
      }

      //SMP JOIN BUTTON
      if (interaction.customId === 'smpjoinbutton') {
        const smpinfo = new MessageEmbed()
          .setAuthor({
            name: 'Here you go!',
            iconURL:
              'https://cdn.discordapp.com/attachments/914596197551976518/915543218391773224/20211201_153108.png',
          })
          .setDescription('https://smp.mmgamer.ml')
          .setColor('#37B3C8');

        await interaction.reply({ embeds: [smpinfo], ephemeral: true });
      }

      //ticket system
      if (interaction.customId === 'create_ticket') {
        let ticketname = `ticket_${interaction.user.username}`;
        let topic = `Ticket opened by ${interaction.user.username}`;
        let antispamo = await interaction.guild.channels.cache.find(
          (ch: TextChannel) => ch.topic === topic
        );
        if (antispamo) {
          interaction.reply({
            content:
              'You already have a ticket opened.. Please delete it before opening another ticket.',
            ephemeral: true,
          });
        } else if (!antispamo) {
          let chparent = '907221628532949052';
          let categ =
            interaction.guild.channels.cache.get('907221628532949052');
          if (!categ) {
            chparent = null;
          }
          interaction.guild.channels
            .create(ticketname, {
              type: 'GUILD_TEXT',
              topic: topic,
              parent: chparent,
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'], //Deny permissions
                  allow: ['ATTACH_FILES'],
                },
                {
                  id: interaction.user.id,
                  allow: [
                    'VIEW_CHANNEL',
                    'SEND_MESSAGES',
                    'READ_MESSAGE_HISTORY',
                  ],
                },
              ],
            })
            .then((ch) => {
              let lep = ['882253713111154700'];
              lep.forEach((e) => {
                ch.permissionOverwrites.create(e, {
                  VIEW_CHANNEL: true,
                  SEND_MESSAGES: true,
                  READ_MESSAGE_HISTORY: true,
                });
              });

              let ticketOpenEmbed = new MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(
                  `Ticket has been raised by ${interaction.user}. We ask the Staffs to summon here\n**User ID**: \`${interaction.user.id}\` | **Username**: \`${interaction.user.tag}\``
                )
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setColor('#F5CE42');

              let close_btn = new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('🔒')
                .setLabel('Close')
                .setCustomId('close_ticket');

              let closerow = new MessageActionRow().addComponents([close_btn]);

              ch.send({
                content: `${interaction.user} \nSupport Team: <@&882253713111154700>`,
                embeds: [ticketOpenEmbed],
                components: [closerow],
              }).then(async (msg) => {
                await msg.pin();
                interaction.reply({
                  content: `Created Ticket check ${ch}`,
                  ephemeral: true,
                });
                Ticket.findOne(
                  {
                    _id: '61b7772d0dafa4b853accb79',
                  },
                  async (err, data) => {
                    if (data) {
                      data
                        .overwrite({
                          TicketNumber: String(parseInt(data.TicketNumber) + 1),
                        })
                        .save();
                    }
                    new Ticket({
                      TicketChannelID: ch.id,
                      TicketMessageID: msg.id,
                      TicketAuthorID: interaction.user.id,
                      TicketReason: 'None',
                      TicketStatus: 'Opened',
                      TicketNumber: data.TicketNumber,
                    }).save();
                  }
                );
              });
            });
        }
      }
      if (interaction.customId === 'close_ticket') {
        Ticket.findOne(
          {
            TicketChannelID: interaction.channel.id,
          },
          async (err, data) => {
            if (data) {
              if (data.TicketStatus !== 'Opened') return;
              interaction.deferUpdate();
              let ticketCreator = data.TicketAuthorID;
              (interaction.channel as TextChannel).permissionOverwrites.delete(
                ticketCreator
              );
              let delete_btn = new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('🗑️')
                .setLabel('Delete')
                .setCustomId('delete_ticket');
              let open_btn = new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('🔓')
                .setLabel('Unlock')
                .setCustomId('open_ticket');
              let tr_btn = new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('📄')
                .setLabel('Transcript')
                .setCustomId('tr_ticket');
              let ticketCloseEmbed = new MessageEmbed()
                .setTitle('Ticket Closed')
                .setDescription(
                  `The ticket has been closed by ${interaction.user} \nClick 🔓 to reopen the ticket. \nClick 📄 to save the transcript. \nClick 🗑️ to delete the ticket.`
                )
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setColor('#7BE2CD');
              let row = new MessageActionRow().addComponents([
                open_btn,
                tr_btn,
                delete_btn,
              ]);
              interaction.channel.send({
                embeds: [ticketCloseEmbed],
                components: [row],
              });
              await Ticket.findOneAndUpdate(
                {
                  TicketChannelID: interaction.channel.id,
                },
                {
                  TicketStatus: 'Closed',
                },
                {
                  new: true,
                  upsert: true,
                }
              );
            }
          }
        );
      }
      if (interaction.customId === 'open_ticket') {
        Ticket.findOne(
          {
            TicketChannelID: interaction.channel.id,
          },
          async (err, data) => {
            if (data) {
              if (data.TicketStatus !== 'Closed') return;
              interaction.deferUpdate();
              let ticketCreator = data.TicketAuthorID;
              (interaction.channel as TextChannel).permissionOverwrites.create(
                ticketCreator,
                {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
                }
              );
              let ticketReopenEmbed = new MessageEmbed()
                .setTitle('Ticket Reopened')
                .setDescription(
                  `The ticket has been reopened by ${interaction.user} \n \nClick 🔒 to close the ticket.`
                )
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setColor('#7BE2CD');
              let close_btn = new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('🔒')
                .setLabel('Close')
                .setCustomId('close_ticket');
              let closerow = new MessageActionRow().addComponents([close_btn]);
              interaction.channel.send({
                embeds: [ticketReopenEmbed],
                components: [closerow],
              });
              await Ticket.findOneAndUpdate(
                {
                  TicketChannelID: interaction.channel.id,
                },
                {
                  TicketStatus: 'Opened',
                },
                {
                  new: true,
                  upsert: true,
                }
              );
            }
          }
        );
      }
      if (interaction.customId === 'tr_ticket') {
        Ticket.findOne(
          {
            TicketChannelID: interaction.channel.id,
          },
          async (err, data) => {
            if (data) {
              if (data.TicketStatus !== 'Closed') return;
              let attach = await createTranscript(
                interaction.channel as TextChannel,
                {
                  fileName: `${
                    (interaction.channel as TextChannel).name
                  }_transcript.html`,
                }
              );
              let kek = (await interaction.reply({
                embeds: [
                  new MessageEmbed().setColor('#075FFF').setAuthor({
                    name: 'Transcripting...',
                    iconURL:
                      'https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1',
                  }),
                ],
                fetchReply: true,
              })) as Message;

              setTimeout(async () => {
                await kek.edit({ files: [attach], embeds: [] });
              }, 3000);
            }
          }
        );
      }
      if (interaction.customId === 'delete_ticket') {
        Ticket.findOne(
          {
            TicketChannelID: interaction.channel.id,
          },
          async (err, data) => {
            if (data) {
              if (data.TicketStatus !== 'Closed') return;
              let attach = await createTranscript(
                interaction.channel as TextChannel,
                {
                  fileName: `${
                    (interaction.channel as TextChannel).name
                  }_transcript.html`,
                }
              );
              interaction.reply({
                content: 'Deleting the ticket and channel.. Please wait.',
              });
              let logch = (
                interaction.message as Message
              ).guild.channels.cache.get('903877432887623720') as TextChannel;
              let Channel = interaction.channel as TextChannel;
              if (logch) {
                let embbb = new MessageEmbed()
                  .setTitle('Ticket Deleted!')
                  .setDescription(
                    `Ticket just got deleted by *<@${interaction.user.id}>* | Username: ***${interaction.user.tag}***\n\nTicket Channel Name: \`${Channel.name}\` | Ticket Channel ID: \`${interaction.channel.id}\`\n${Channel.topic}`
                  )
                  .setTimestamp()
                  .setColor('#7BE2CD');
                setTimeout(async () => {
                  logch.send({ embeds: [embbb], components: [] }).then((c) => {
                    c.channel.send({
                      content: `***Transcript:*** \`#${Channel.name}\``,
                      files: [attach],
                    });
                  });
                }, 3000);
              }
              setTimeout(() => {
                let delch = (
                  interaction.message as Message
                ).guild.channels.cache.get(
                  (interaction.message as Message).channel.id
                );
                delch.delete().catch((err) => {
                  console.log(err);
                });
              }, 2000);
              await Ticket.findOneAndDelete({
                TicketChannelID: Channel.id,
              });
            }
          }
        );
      }
    }

    /*==============================================================================
     appeal_for_rewards: "Claimed" and "Delete Message" buttons
   ==============================================================================*/

    if (interaction.isButton()) {
      const { channel, message, customId } = interaction;
      const targetMessage = await channel.messages.fetch(message.id, {
        cache: true,
        force: true,
      });

      if (customId === 'appeal_for_rewards_claimed_button') {
        const newButton = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Claimed')
            .setCustomId('appeal_for_rewards_claimed_button(disabled=true)')
            .setDisabled(true)
        );
        targetMessage.edit({
          components: [newButton],
        });
        interaction.deferUpdate();
      }

      /*==============================================================================
     /help command interaction updates
  ==============================================================================*/

      const rowFromHelpCommand = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('Command List')
          .setStyle('SECONDARY')
          .setEmoji('932665354105278494')
          .setCustomId('COMMAND_LIST_BTN_HELP_CMD'),

        new MessageButton()
          .setLabel('AI')
          .setStyle('SECONDARY')
          .setEmoji('926515055594455100')
          .setCustomId('AI_BTN_HELP_CMD')
      );

      if (customId === 'AI_BTN_HELP_CMD') {
        const AI = new MessageEmbed()
          .setAuthor({
            name: 'Artificial Intelligence',
            iconURL: 'https://cdn.discordapp.com/emojis/926515055594455100.png',
          })
          .setColor(client.config.botColor)
          .setDescription(
            `${client.user?.username} has an advanced Artificial Intelligence. \n<:MM_arrowGREEN:932674760960245840> To chat, start by pinging the bot. \n(Example: <@${client.user?.id}> hello)`
          )
          .addField(
            'Special Features',
            '<:MM_arrowGREEN:932674760960245840> `joke, translate`'
          );

        rowFromHelpCommand.components[1].setDisabled(true);
        interaction.update({ embeds: [AI], components: [rowFromHelpCommand] });

        setTimeout(() => {
          rowFromHelpCommand.components[0].setDisabled(true);

          interaction.update({ components: [rowFromHelpCommand] });
        }, 17000);
      }

      if (customId === 'COMMAND_LIST_BTN_HELP_CMD') {
        const array = [];
        const uncategorized = [];

        const emoji = {
          Uncategorized: '<:MM_unsorted:932631453311856670>',
          Unknown: '<:MM_unknown_file:932628652095586344>',
          Info: '<:MM_info:926686558906617927>',
          Utilities: '<:MM_utility:927297279377944616>',
          Fun: '<:MM_fun:932630167128506388>',
          Developer: '<:MM_Utilities_dev:932103812116795432>',
          Music: '<a:MM_music:932636939817996338>',
          Anime: '<:MM_A_remwink:909134156003418192>',
          'Moderation & Management': '<:MM_staff:932629900374990918>',
        };

        const commands = client.commands.map((cmd) => cmd);

        for (const o of commands) {
          if (o.category) {
            const obj = {
              name: o.category,
              value: o.subcommands || o.name,
            };
            array.push(obj);
          } else {
            uncategorized.push(o.subcommands || o.name);
          }
        }

        const NotFields = [];

        array.forEach((idk) => {
          const existing = NotFields.filter((v, i) => {
            return v.name == idk.name;
          });
          if (existing.length) {
            const existingIndex = NotFields.indexOf(existing[0]);
            NotFields[existingIndex].value = NotFields[
              existingIndex
            ].value.concat(idk.value);
          } else {
            if (typeof idk.value == 'string') idk.value = [idk.value];
            NotFields.push(idk);
          }
        });

        const YesFields = [];
        for (const NaV of NotFields) {
          const obj = {
            name: `${emoji[NaV.name] || emoji.Unknown} ${NaV.name} (${
              NaV.value.length
            })`,
            value: `\`${NaV.value.join('`, `')}\``,
          };
          YesFields.push(obj);
        }

        for (let i = 0; i < uncategorized.length; i++) {
          if (Array.isArray(uncategorized[i])) {
            uncategorized.push(...uncategorized[i]);
            uncategorized[i] = '';
          }
        }

        const uncategorizedFiltered = uncategorized.filter((el) => {
          return el != null && el != '';
        });

        const obj = {
          name: `${emoji.Uncategorized} Uncategorized (${uncategorizedFiltered.length})`,
          value: `\`${uncategorizedFiltered.join('`, `')}\``,
        };

        if (uncategorizedFiltered.length) YesFields.push(obj);

        const embed = new MessageEmbed()
          .setAuthor({
            name: client.user?.username + '| Help Command',
            iconURL: client.user?.displayAvatarURL({ size: 512 }),
          })
          .setThumbnail(
            'https://cdn.discordapp.com/emojis/926515055594455100.png'
          )
          .addFields(YesFields)
          .addField(
            '<:MM_question:919531896227135550> How to use the commands:',
            'To use a command you must type a slash (/) followed by the name of the command. In [bot-commands](https://discord.com/channels/485463924007763970/887068533136195604)!\n\nSyntax: /`[command name] [options]`\nExample: /userinfo `[@user]`'
          )
          .setColor(client.config.botColor);

        rowFromHelpCommand.components[0].setDisabled(true);
        interaction.update({
          embeds: [embed],
          components: [rowFromHelpCommand],
        });

        setTimeout(() => {
          rowFromHelpCommand.components[1].setDisabled(true);

          interaction.update({ components: [rowFromHelpCommand] });
        }, 17000);
      }

      ////// UPDATE STAFF LIST //////

      if (customId === 'UPDATE_STAFF_LIST') {
        function reply(message: string) {
          (interaction as ButtonInteraction).reply({
            content: message,
            ephemeral: true,
          });
        }

        if (
          !(interaction.member.permissions as Readonly<Permissions>).has(
            'MANAGE_CHANNELS'
          )
        )
          return reply(
            "You don't have permission to update staff list <:MM_hm_wtfman:874637715444994058>"
          );

        if (cooldownOfStaffList.has((interaction.member as GuildMember).id))
          return reply('You are on cooldown!');

        const roles = {
            admin: interaction.guild.roles.cache.get('903566577293721620'),
            srMod: interaction.guild.roles.cache.get('626015899425439744'),
            smpDev: interaction.guild.roles.cache.get('888350418957119528'),
            dcMod: interaction.guild.roles.cache.get('882253708338020442'),
            smpStaff: interaction.guild.roles.cache.get('882253716034568283'),
            beemTeam: interaction.guild.roles.cache.get('882253713111154700'),
            trainee: interaction.guild.roles.cache.get('893197592974987304'),
            builder: interaction.guild.roles.cache.get('944240796813652038'),
          },
          embed = new MessageEmbed()
            .setAuthor({
              name: 'Staff list - MM Gamer',
              iconURL:
                'https://cdn.discordapp.com/emojis/901296752202772540.png?v=1&size=512',
            })
            .setDescription(
              "Welcome to the Staff List of MM Gamer. If you're looking for a place to find all the currently available staff members of this community, this is the right place."
            )
            .setColor('#2f3136')
            .setFooter({ text: 'Last updated: ' })
            .setTimestamp()
            .addFields(
              {
                name: 'How to apply:',
                value:
                  'If you want to apply for a staff member, you would have to wait for the applications to open.\n.\n.',
              },
              {
                name: 'Owner `∞`',
                value: `> <@${interaction.guild.ownerId}>`,
              },
              {
                name: `${roles.admin.name}s \`${roles.admin.members.size}\``,
                value:
                  roles.admin.members.size > 0
                    ? `> ${roles.admin.members.map((m) => m.user).join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.srMod.name}s \`${roles.srMod.members.size}\``,
                value:
                  roles.srMod.members.size > 0
                    ? `> ${roles.srMod.members.map((m) => m.user).join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.smpDev.name}s \`${roles.smpDev.members.size}\``,
                value:
                  roles.smpDev.members.size > 0
                    ? `> ${roles.smpDev.members
                        .map((m) => m.user)
                        .join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.dcMod.name}s \`${roles.dcMod.members.size}\``,
                value:
                  roles.dcMod.members.size > 0
                    ? `> ${roles.dcMod.members.map((m) => m.user).join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.smpStaff.name} \`${roles.smpStaff.members.size}\``,
                value:
                  roles.smpStaff.members.size > 0
                    ? `> ${roles.smpStaff.members
                        .map((m) => m.user)
                        .join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.beemTeam.name} \`${roles.beemTeam.members.size}\``,
                value:
                  roles.beemTeam.members.size > 0
                    ? `> ${roles.beemTeam.members
                        .map((m) => m.user)
                        .join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.trainee.name}s \`${roles.trainee.members.size}\``,
                value:
                  roles.trainee.members.size > 0
                    ? `> ${roles.trainee.members
                        .map((m) => m.user)
                        .join('\n> ')}`
                    : '`None`',
              },
              {
                name: `${roles.builder.name}s \`${roles.builder.members.size}\``,
                value:
                  roles.builder.members.size > 0
                    ? `> ${roles.builder.members
                        .map((m) => m.user)
                        .join(
                          '\n> '
                        )}\n.\n.\n**For corrections, mistakes ping <@826899456909770763> <:MM_A_uhh:889565184929198100>**`
                    : '`None`\n.\n.\n**For corrections, mistakes ping <@826899456909770763> <:MM_A_uhh:889565184929198100>**',
              }
            ),
          buttonOfStaffList = new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle('SECONDARY')
              .setLabel('Update')
              .setEmoji('919632285559586877')
              .setCustomId('UPDATE_STAFF_LIST')
          );

        interaction.update({
          embeds: [embed],
          components: [buttonOfStaffList],
        });

        cooldownOfStaffList.add((interaction.member as GuildMember).id);
        setTimeout(() => {
          cooldownOfStaffList.delete((interaction.member as GuildMember).id);
        }, 10000);
      }
    }
  }
);
