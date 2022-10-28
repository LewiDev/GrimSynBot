const { Schema, model, SchemaType } = require('mongoose');

const ticketSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    userId: String,
    channelId: String,
    transcript: String,
    timeOpened: Schema.Types.Date,
    timeClosed: Schema.Types.Date
})

module.exports = model('ticket', ticketSchema, "ticket");