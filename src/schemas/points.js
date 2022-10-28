const { Schema, model } = require('mongoose');

const pointsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    userId: String,
    points: Schema.Types.Number,
    messages: Schema.Types.Number
})

module.exports = model('points', pointsSchema, "points");