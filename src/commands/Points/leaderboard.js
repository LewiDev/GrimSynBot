const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pointsschem = require('../../schemas/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top 5 point holders in the server!'),
    async execute(interaction, client) {
        const leaderboard = await pointsschem.find({ guildId: interaction.guildId }).sort({points: 'desc'}).limit(5);

        if (leaderboard.length < 1) return interaction.reply({content:'Leaderboard Empty'});

        const computedArray = [];

        for (const key of leaderboard) {
            const user = await client.users.fetch(key.userId) || { username: "Unknown", discriminator: "0000" };
            computedArray.push({
              guildId: key.guildId,
              userId: key.userId,
              points: key.points,
              position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
              username: user.username,
              discriminator: user.discriminator
            });
        }

        const map = computedArray.map(e => `\`\`\`${e.position}. ${e.username}#${e.discriminator} │ Points: ${e.points.toLocaleString()}\`\`\``);

        const NewEmbed = new EmbedBuilder()
     		.setColor('White')
    		.setTitle("GrimSyn Points Leaderboard") 
    		.setDescription(`${map.join("")}`)

    	interaction.reply({embeds: [NewEmbed]});
    }
}