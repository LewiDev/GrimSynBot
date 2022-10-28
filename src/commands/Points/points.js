const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const points = require('../../schemas/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Displays your points')
        .addUserOption(option => option.setName('target').setDescription('The user points you want to see!').setRequired(false)),
    async execute(interaction, client) {
        let pointsProfile = await points.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
        const embed = new EmbedBuilder()
            .setColor('White')
            
        if(!interaction.options.getUser('target')) {
            embed.setTitle(`${interaction.user.username}\'s Points`)
            embed.setThumbnail(interaction.user.displayAvatarURL())
        } else {
            const target = interaction.options.getUser('target')
            pointsProfile = await points.findOne({ userId: target.id, guildId: interaction.guildId });
            embed.setTitle(`${target.username}\'s Points`)
            embed.setThumbnail(target.displayAvatarURL())
        }


        if(!pointsProfile) {
            embed.setDescription(`\n**Points: 0**`);
        } else {
            embed.setDescription(`\n**Points: **${Math.round(pointsProfile.points * 10) / 10}`);
        }
        await interaction.reply({
            embeds: [embed]
        })

    }
}