const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { criarSala } = require('../services/nixApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('criarsala')
    .setDescription('Cria uma sala de Free Fire')
    .addStringOption(opt =>
      opt.setName('modo')
        .setDescription('Modo da partida (ex: solo, dupla, squad)')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('vagas')
        .setDescription('Número de vagas')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('tipo')
        .setDescription('Tipo da sala (ex: normal, ranqueada)')
        .setRequired(false)),

  async execute(interaction) {
    const modo = interaction.options.getString('modo');
    const vagas = interaction.options.getInteger('vagas');
    const tipo = interaction.options.getString('tipo') || 'normal';

    await interaction.deferReply();

    try {
      const sala = await criarSala({ modo, vagas, tipo });

      const embed = new EmbedBuilder()
        .setTitle('🎮 Sala criada com sucesso!')
        .addFields(
          { name: 'ID da Sala', value: String(sala.id ?? '—'), inline: true },
          { name: 'Senha', value: String(sala.senha ?? '—'), inline: true },
          { name: 'Modo', value: modo, inline: true },
          { name: 'Vagas', value: String(vagas), inline: true },
          { name: 'Tipo', value: tipo, inline: true }
        )
        .setColor(0x00b0f4)
        .setFooter({ text: `Criada por ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`❌ ${err.message}`);
    }
  }
};
