const { SlashCommandBuilder } = require('discord.js');
const { fecharSala } = require('../services/nixApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fecharsala')
    .setDescription('Encerra uma sala de Free Fire')
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('ID da sala a ser fechada')
        .setRequired(true)),

  async execute(interaction) {
    const salaId = interaction.options.getString('id');
    await interaction.deferReply();

    try {
      await fecharSala(salaId);
      await interaction.editReply(`✅ Sala \`${salaId}\` encerrada com sucesso.`);
    } catch (err) {
      await interaction.editReply(`❌ ${err.message}`);
    }
  }
};
