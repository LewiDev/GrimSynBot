const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const punishment = require('../../schemas/punishment');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hist')
        .setDescription('View a members punishment history!')
        .addUserOption(option => option.setName("target").setDescription("The members history you would like to view!").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const target = interaction.options.getUser("target");

        let desc = "**Last 10 Punishments:**\n\`\`\`"

        const punishments = await punishment.find({ punishedId: target.id }).sort({ timestamp: -1}).limit(10);

        if(!punishments) {
            desc = "No Previous Punishments"
        } else {
            for(const punish of punishments) {
                desc += `${punish.type.toUpperCase()} | ${punish.reason}\n`
            }
            desc += `\`\`\``
        }

        

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`${target.username}\'s History`)
            .setDescription(desc);

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

        
    }
}