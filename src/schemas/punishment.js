const { Schema, model } = require('mongoose');

const punishmentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    punishedId: String,
    punisherId: String,
    reason: String,
    type: String,
    length: Schema.Types.Number,
    timestamp: Schema.Types.Date
})

module.exports = model('punishment', punishmentSchema, "punishment");