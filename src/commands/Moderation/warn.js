const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const punishment = require('../../schemas/punishment');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user in the server!')
        .addUserOption(option => option.setName("target").setDescription("The member you would like to warn!").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The Reason you would like to warn this member!"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") || "No Reason Provided!";

        let punishProfile = await new punishment({
            _id: mongoose.Types.ObjectId(),
            punishedId: target.id,
            punisherId: interaction.user.id,
            reason: reason,
            type: "warn",
            length: 0,
            timestamp: new Date()
        })

        await punishProfile.save().catch(console.error);

        

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle("User Warned!")
            .setDescription(`Successfully Warned ${target.username}\n**Reason:** ${reason}`);

        const embed2 = new EmbedBuilder()
            .setColor('Red')
            .setTitle("WARNING")
            .setDescription(`You have been Warned\n**Reason:** ${reason}`);

        client.users.send(`${target.id}`, {embeds: [embed2]}).catch(console.error);

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}