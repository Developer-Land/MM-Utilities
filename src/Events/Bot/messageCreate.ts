import {
  GuildTextBasedChannel,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ThreadChannel,
  WebhookClient,
} from 'discord.js';
import moment from 'moment';
import { Agent, request } from 'undici';
import { client } from '../../index';
import { Afk } from '../../Models/Go/afk';
import { leveling } from '../../Models/Leveling/leveling';
import { levelingIgnore } from '../../Models/Leveling/levelingignore';
import { Event } from '../../Structures/Event';
const earnedXpRecently = new Set();

export default new Event(client, 'messageCreate', async (message: Message) => {
  const args = message.content.trim().split(/ +/g);
  // ChatBot
  if (
    message.content.startsWith('<@911312019112734760> ') ||
    message.content.startsWith('<@!911312019112734760> ') ||
    (message.mentions.has(client.user) &&
      message.mentions.repliedUser &&
      message.mentions.repliedUser.id === '911312019112734760')
  ) {
    if (!message.author.bot) {
      const mentioned_users = message.mentions.members?.map(
        (x) => x.displayName
      );
      mentioned_users.shift();
      message.content = message.content
        .replace(/@(everyone)/gi, 'everyone')
        .replace(/@(here)/gi, 'here')
        .replace(/<@911312019112734760> |<@!911312019112734760> /i, '');
      mentioned_users.forEach((displayName) => {
        message.content = message.content.replace(
          /<@!*&*[0-9]+>/gi,
          displayName
        );
      });
      message.channel.sendTyping();
      if (!message.content)
        return message.channel.send('Please say something.');
      let reply = (
        await request(
          `https://developerland.ml/api/chatbot?message=${encodeURIComponent(
            message.content.toLowerCase()
          )}&name=${
            client.user.username
          }&master=EXPress%20and%20Dorpon&company=DeveloperLand&user=${
            message.author.id
          }&gender=male&birthplace=MM%20Gamer%27s%20Server&age=1&birthdate=Nov%2021%2C%202021&birthyear=2021&birthday=Nov%2021&location=MM%20Gamer%27s%20Server&country=India&city=MM%20Gamer%27s%20Server&state=MM%20Gamer%27s%20Server`
        )
          .then((res) => res.body.json())
          .catch(() =>
            message.reply({
              content: 'A error occurred',
              allowedMentions: { repliedUser: true },
            })
          )
      ).message;

      message.reply({
        content: `${reply}`,
        allowedMentions: { repliedUser: true },
      });
    }
  }
  // Interesting
  const interestingregex = /interesting|Interesting/i;

  if (interestingregex.test(message.content) && !message.author.bot) {
    const InterestingTexts = [
      'Indeed!',
      '<a:MM_pet69:880814964871417856>',
      'Yeah, it is!',
      '<a:MM_d_Burger2:881205081507266601><a:MM_d_Burger1:881205053195714681>',
      '<:MM_A_02no:890545130820489247>',
    ];
    const randomInterestingTexts =
      InterestingTexts[Math.floor(Math.random() * InterestingTexts.length)];
    message.reply({
      content: `${randomInterestingTexts}`,
      allowedMentions: { repliedUser: true },
    });
  }
  // Leveling System
  if (
    !earnedXpRecently.has(message.author.id) &&
    !message.author.bot &&
    message.guild
  ) {
    let ignoreCH = await levelingIgnore.findOne({
      guildID: message.guild.id,
      ID: message.channel.id,
    });
    let ignoreRD = await levelingIgnore.find({
      guildID: message.guild.id,
    });
    let ignoreRL;
    if (ignoreRD) {
      ignoreRD.forEach((x) => {
        if (message.member.roles.cache.has(x.ID)) {
          ignoreRL = true;
        }
      });
    }
    if (!ignoreCH) {
      if (!ignoreRL) {
        const user = await leveling.findOne({
          userID: message.author.id,
          guildID: message.guild.id,
        });
        let randomXp = Math.floor(Math.random() * 21) + 40;
        const xp = randomXp;
        if (!user) {
          const newUser = new leveling({
            userID: message.author.id,
            guildID: message.guild.id,
            xp: xp,
            level: Math.floor(0.1 * Math.sqrt(xp)),
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        } else {
          user.xp += randomXp;
          user.level = Math.floor(0.1 * Math.sqrt(user.xp));
          user.lastUpdated = new Date();
          await user
            .save()
            .catch((e) => console.log(`Failed to append xp: ${e}`));
        }
        earnedXpRecently.add(message.author.id);
        setTimeout(() => {
          earnedXpRecently.delete(message.author.id);
        }, 45000);
      }
    }
  }

  // AFK System
  if (!message.author.bot) {
    let afk = await Afk.findOne({
      userID: message.author.id,
      guildID: message.guild.id,
    });
    if (afk) {
      message
        .reply({ content: `<@${message.author.id}> is back!` })
        .then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 5000);
        });
      await Afk.deleteOne({
        userID: message.author.id,
        guildID: message.guild.id,
      });
    }
    message.mentions.users.forEach((user) => {
      Afk.findOne({
        userID: user.id,
        guildID: message.guild.id,
      }).then((afk) => {
        if (afk) {
          message.reply({
            content: `<@${user.id}> is Afk! with reason: ${
              afk.message
            } - ${moment(afk.time).fromNow()}`,
            allowedMentions: { users: [] },
          });
        }
      });
    });
  }

  // Spell/Grammar checker
  if (message.channel.id === '975026656802656347') {
    let data = await request(
      `https://orthographe.reverso.net/api/v1/Spelling?text=${encodeURIComponent(
        message.content
      ).replace(/%20/gi, '')}&language=eng&getCorrectionDetails=true`,
      {
        dispatcher: new Agent({
          connect: {
            rejectUnauthorized: false,
          },
        }),
        method: 'GET',
      }
    ).then((res) => res.body.json());
    if (data.corrections.length > 25)
      return message.reply('Too many mistakes.');
    if (data.corrections.length > 0) {
      let CorrectionsEmbed = new MessageEmbed();
      CorrectionsEmbed.setTitle('Corrections!');
      CorrectionsEmbed.setColor(client.config.botColor);
      await data.corrections.forEach((correction, index) => {
        CorrectionsEmbed.addFields({
          name: `${index + 1}. ${correction.shortDescription} at ${
            correction.startIndex
          }-${correction.endIndex}`,
          value: `Mistake ${correction.mistakeText}, Correction ${correction.correctionText}`,
          inline: true,
        });
      });
      message.reply({ embeds: [CorrectionsEmbed] });
    } else {
      message.reply('No mistakes found!');
    }
  }

  // #verification
  // Send Answers to the Gatekeepers
  if (message.channel.id === '1008085778850648156') {
    if (
      message.member.roles.cache.has('854647752197931038') ||
      message.author.bot
    )
      return;

    const channel = message.guild.channels.cache.get(
      '1008754426678353970'
    ) as GuildTextBasedChannel;

    if (channel instanceof ThreadChannel) return;

    let webhookUrl: string;
    let myWebhooks = (await channel.fetchWebhooks()).filter(
      (webhook) => webhook.owner.id === client.user.id
    );
    webhookUrl =
      myWebhooks.size !== 0
        ? myWebhooks.first().url
        : (
            await channel.createWebhook('Verification', {
              avatar: client.user.displayAvatarURL(),
            })
          ).url;

    const webhookClient = new WebhookClient({ url: webhookUrl });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Accept')
        .setCustomId(`${message.author.id}.verification.accept`),
      new MessageButton()
        .setStyle('DANGER')
        .setLabel('Decline')
        .setCustomId(`${message.author.id}.verification.reject`)
    );

    webhookClient.send({
      content: message.content,
      username: message.author.username,
      avatarURL: message.author.displayAvatarURL({ format: 'png', size: 4096 }),
      components: [row],
    });

    message.author.send({
      embeds: [
        new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ format: 'png', size: 512 }))
          .setTitle('Thank you for joining our server!')
          .setDescription(
            'Our "Gatekeepers" will try to give you access to the server as soon as possible if you have written the answers honestly.'
          )
          .setColor(client.config.botColor)
          .addFields({
            name: 'Your answers:',
            value: `\`\`\`txt\n${message.content}\`\`\``,
          }),
      ],
    });

    setTimeout(() => message.delete(), 1600);
  } // #verification
});
