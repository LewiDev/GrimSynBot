const mongoose = require('mongoose')
const ticket = require('../../schemas/ticket')
const discordTranscripts = require('discord-html-transcripts');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: {
        name: 'ticketclose'
    },
    async execute(interaction, client) {
        if(!interaction.member.roles.cache.some(role => role.name.toLowerCase() === 'staff')) return interaction.reply({
            content: `${interaction.user.username}, You do not have permission to close this ticket!`,
            ephemeral: true
        })

        const channel = interaction.channel;

        const attachment = await discordTranscripts.createTranscript(channel, {
            saveImages: true,
            poweredBy: false
        });

        const stringtranscript = await discordTranscripts.createTranscript(channel, {
            saveImages: true,
            poweredBy: false,
            returnType: 'string'
        });

        const embed = new EmbedBuilder()
            .setTitle("Your Transcript")
            .setDescription(`Download File above and open to view the messages sent in your ticket!\n**Closed By: **${interaction.user.username}\n**Closed At: **${new Date().toISOString().substring(0,10)}`)
        

        let ticketProfile = await ticket.findOne({ channelId: channel.id });
        ticketProfile.timeClosed = new Date()
        ticketProfile.transcript = stringtranscript
        ticketProfile.save().catch(console.error);

        await channel.delete()

        interaction.member.send({
            embeds: [embed],
            files: [attachment],
        });

        
    }
}