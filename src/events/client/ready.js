const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await client.user.setActivity('GrimSyn', { type: ActivityType.Watching })
        console.log(`${client.user.tag} is logged in and online!`);
    }
}