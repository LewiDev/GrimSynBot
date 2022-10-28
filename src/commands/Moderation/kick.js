const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const punishment = require('../../schemas/punishment');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server!')
        .addUserOption(option => option.setName("target").setDescription("The member you would like to kick!").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The Reason you would like to kick this member!"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") || "No Reason Provided!";

        let punishProfile = await new punishment({
            _id: mongoose.Types.ObjectId(),
            punishedId: target.id,
            punisherId: interaction.user.id,
            reason: reason,
            type: "kick",
            length: 0,
            timestamp: new Date()
        })

        await punishProfile.save().catch(console.error);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle("User Kicked!")
            .setDescription(`Successfully Kicked ${target.username} from the server\n**Reason:** ${reason}`);

        await interaction.guild.members.kick(target, reason);

        await punishProfile.save().catch(console.error);
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}