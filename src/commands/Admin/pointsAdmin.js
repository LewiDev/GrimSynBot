const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const points = require('../../schemas/points')
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pointsadmin')
        .setDescription('Allows Admins to control Members Points')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add points to a members account!').addUserOption(option => option.setName('target').setDescription('The member to recieve points!').setRequired(true)).addNumberOption(option => option.setName('amount').setDescription('Amount of points you want to add to the users account!').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('remove points from a members account!').addUserOption(option => option.setName('target').setDescription('The member to remove points from!').setRequired(true)).addNumberOption(option => option.setName('amount').setDescription('Amount of points you want to take from the users account!').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('reset').setDescription('Resets a members points to 0!').addUserOption(option => option.setName('target').setDescription('The members points you want to reset!').setRequired(true))),
    async execute(interaction, client) {
            if(interaction.options.getSubcommand() === 'add') {
                const target = interaction.options.getUser('target');
                const amount = interaction.options.getNumber('amount');

                let pointsProfile = await points.findOne({ userId: target.id, guildId: interaction.guildId });
                if(!pointsProfile) {
                    pointsProfile = await new points({
                        _id: mongoose.Types.ObjectId(),
                        guildId: interaction.guild.id,
                        userId: target.id,
                        points: amount,
                        messages: 0
                    })
                } else {
                    pointsProfile.points += amount;
                    await pointsProfile.save().catch(console.error);;
                }
                interaction.reply(
                    {
                        content: `Successfully added ${amount} points to ${target.username}\'s balance`,
                        ephemeral: true
                    }
                )
            } else if(interaction.options.getSubcommand() === 'remove') {
                const target = interaction.options.getUser('target');
                const amount = interaction.options.getNumber('amount');

                let pointsProfile = await points.findOne({ userId: target.id, guildId: interaction.guildId });
                if(!pointsProfile) {
                    pointsProfile = await new points({
                        _id: mongoose.Types.ObjectId(),
                        guildId: interaction.guild.id,
                        userId: target.id,
                        points: 0,
                        messages: 0
                    })
                    interaction.reply({
                        content: `${target.username} does not have emopugh points to do this!`,
                        ephemeral: true
                    })
                    return;
                }
                if(pointsProfile.points >= amount) {
                    pointsProfile.points -= amount;
                    await pointsProfile.save().catch(console.error);
                    interaction.reply(
                        {
                            content: `Successfully removed ${amount} points from ${target.username}\'s balance`,
                            ephemeral: true
                        }
                    )
                } else {
                    interaction.reply({
                        content: `${target.username} does not have emopugh points to do this!`,
                        ephemeral: true
                    })
                }
            } else if (interaction.options.getSubcommand() === 'reset') {
                const target = interaction.options.getUser('target');

                let pointsProfile = await points.findOne({ userId: target.id, guildId: interaction.guildId });
                if(!pointsProfile) {
                    pointsProfile = await new points({
                        _id: mongoose.Types.ObjectId(),
                        guildId: interaction.guild.id,
                        userId: target.id,
                        points: 0,
                        messages: 0
                    })
                } else {
                    pointsProfile.points = 0;
                    await pointsProfile.save().catch(console.error);
                }
                interaction.reply({
                    content: `${target.username}\'s points have been reset!`,
                    ephemeral: true
                })
            }
    }
}