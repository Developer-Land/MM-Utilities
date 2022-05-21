import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'pokemon',
  description: 'check pokemon',
  options: [
    {
      name: 'query',
      description: 'the name of pokemon you want to check',
      type: 'STRING',
      required: true,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let query = interaction.options.getString('query');
    let poke = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=100000'
    ).then((res) => res.json());
    let PokeRegex = new RegExp(query.replace(/_/gi, '.'));
    let pokeJson = JSON.stringify(poke.results);
    let found = pokeJson.match(PokeRegex);
    if (found.length === 0) return interaction.reply('no pokemon found');
    let embed = new MessageEmbed()
      .setTitle('Found Pokemons')
      .setDescription(found.map((x) => x).join('\n'))
      .setColor(client.config.botColor);
    interaction.reply({ embeds: [embed] });
  },
});
