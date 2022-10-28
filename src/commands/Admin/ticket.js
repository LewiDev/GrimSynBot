const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Sends the Ticket panel!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setTitle('Report a player or Dispute a mute')
            .setDescription('Click the button below to open a support ticket!')
            .setColor('White')

        const button = new ButtonBuilder()
            .setCustomId('ticketcreate')
            .setLabel('Create a Ticket!')
            .setStyle(ButtonStyle.Primary)

        await interaction.reply({
            content: 'Sending...',
            ephemeral: true
        })

        interaction.channel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        })
    }
}