import { Message } from 'discord.js';
import moment from 'moment';
import fetch, { Response } from 'node-fetch';
import { client } from '../../index';
import { Afk } from '../../models/go/afk';
import { leveling } from '../../models/leveling/leveling';
import { levelingIgnore } from '../../models/leveling/levelingignore';
import { Event } from '../../structures/Event';
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
      fetch(
        `https://express-api.ml/api/chatbot?message=${encodeURIComponent(
          message.content.toLowerCase()
        )}&name=${
          client.user.username
        }&master=EXPress%20and%20Dorpon&company=DeveloperLand&user=${
          message.author.id
        }&gender=male&birthplace=MM%20Gamer%27s%20Server&age=1&birthdate=Nov%2021%2C%202021&birthyear=2021&birthday=Nov%2021&location=MM%20Gamer%27s%20Server&country=India&city=MM%20Gamer%27s%20Server&state=MM%20Gamer%27s%20Server`
      )
        .catch((error) =>
          message.reply({
            content: 'A error occurred',
            allowedMentions: { repliedUser: true },
          })
        )
        .then((res) => (res as Response).json())
        .then((data) => {
          message.reply({
            content: `${data.message}`,
            allowedMentions: { repliedUser: true },
          });
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

  // Delete messages without 'Attachments' in '#staff-media'
  if (message.channel.id === '938447207017873438') {
    if (message.author.bot) return;
    if (!message.attachments.size) {
      message.delete();
      message.channel
        .send(
          `
        <@${message.author.id}>, that's not an attachment!
        `
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 3000);
        });
    }
  }
});
