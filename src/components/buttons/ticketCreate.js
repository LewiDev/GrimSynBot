const {  ChannelType,  EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")
const mongoose = require('mongoose')
const ticket = require('../../schemas/ticket')

module.exports = {
    data: {
        name: 'ticketcreate'
    },
    async execute(interaction, client) {
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.user.id, // user
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'staff').id.toString(), // staff
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: interaction.guild.id, // everyone
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                },
            ]
        })

        const ticketProfile = await new ticket({
            _id: mongoose.Types.ObjectId(),
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            channelId: channel.id,
            transcript: 'Still Open',
            timeOpened: new Date(),
            timeClosed: new Date().setDate(0)
        })
        await ticketProfile.save().catch(console.error);

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`Hey ${interaction.user.username}`)
            .setDescription('Please Describe your problem below and we will respond ASAP!')

        const button = new ButtonBuilder()
            .setCustomId('ticketclose')
            .setLabel('Close This Ticket')
            .setStyle(ButtonStyle.Danger)

        channel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        })

        
        await interaction.reply({
            content: `Ticket Created: ${channel}`, 
            ephemeral: true
        })
    }
}