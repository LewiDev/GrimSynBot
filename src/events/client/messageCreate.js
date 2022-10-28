const points = require("../../schemas/points");
const { requiredMessages, pointsRecieved } = process.env
const mongoose = require('mongoose');


module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if(message.author.bot) return;


        let pointsProfile = await points.findOne({ userId: message.author.id, guildId: message.guild.id });
        if(!pointsProfile) { 
            pointsProfile = await new points({
                _id: mongoose.Types.ObjectId(),
                guildId: message.guild.id,
                userId: message.author.id,
                points: 0.0,
                messages: 1
            })

            await pointsProfile.save().catch(console.error);
        } else {
            if(pointsProfile.messages < Number(requiredMessages)) {
                pointsProfile.messages++;
                await pointsProfile.save().catch(console.error);
                
            } else {
                pointsProfile.messages = 0;
                pointsProfile.points += Number(pointsRecieved);
                await pointsProfile.save().catch(console.error);
            }
        }


    }
}