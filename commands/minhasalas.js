const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { listarSalas } = require('../services/nixApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minhasalas')
    .setDescription('Lista as salas que você criou'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const salas = await listarSalas(interaction.user.id);

      if (!salas || salas.length === 0) {
        return interaction.editReply('Você não tem salas ativas no momento.');
      }

      const embed = new EmbedBuilder()
        .setTitle('📋 Suas salas ativas')
        .setDescription(
          salas.map(s => `**ID:** ${s.id} — **Modo:** ${s.modo} — **Vagas:** ${s.vagas}`).join('\n')
        )
        .setColor(0x00b0f4);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`❌ ${err.message}`);
    }
  }
};
