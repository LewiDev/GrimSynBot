const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const punishment = require('../../schemas/punishment');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempmute')
        .setDescription('Temp Mutes a user in the server!')
        .addUserOption(option => option.setName("target").setDescription("The member you would like to Temp-Mute!").setRequired(true))
        .addNumberOption(option => option.setName("time").setDescription("How long you want to mute the user for! (in mins)").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The Reason you would like to Mute this member!"))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser("target");
        const length = interaction.options.getNumber("time")
        const reason = interaction.options.getString("reason") || "No Reason Provided!";

        let punishProfile = await new punishment({
            _id: mongoose.Types.ObjectId(),
            punishedId: target.id,
            punisherId: interaction.user.id,
            reason: reason,
            type: "tempmute",
            length: length,
            timestamp: new Date()
        })

        await punishProfile.save().catch(console.error);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle("User Muterd!")
            .setDescription(`Successfully Muted ${target.username} for ${length} Minuites server\n**Reason:** ${reason}`);
        
        await interaction.guild.members.cache.get(target.id).timeout((length * 60 *1000), reason)

        await punishProfile.save().catch(console.error);
            
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}