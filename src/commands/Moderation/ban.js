const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const punishment = require('../../schemas/punishment');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server!')
        .addUserOption(option => option.setName("target").setDescription("The member you would like to ban!").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The Reason you would like to ban this member!"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") || "No Reason Provided!";

        let punishProfile = await new punishment({
            _id: mongoose.Types.ObjectId(),
            punishedId: target.id,
            punisherId: interaction.user.id,
            reason: reason,
            type: "ban",
            length: 0,
            timestamp: new Date()
        })

        await punishProfile.save().catch(console.error);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle("User Banned!")
            .setDescription(`Successfully Banned ${target.username} from the server\n**Reason:** ${reason}`);

        await interaction.guild.members.ban(target, reason);
        await punishProfile.save().catch(console.error);

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}