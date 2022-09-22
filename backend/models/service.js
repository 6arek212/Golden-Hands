const mongoose = require('mongoose')

serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ['Hair Cut', 'Face Cut' ,'Wax', 'Massage'],
    },
    price: {
        type: Number,
        required: true,
    },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
})

serviceSchema.index({ worker: 1, title: 1 }, { unique: true });


module.exports = {
    serviceSchema,
    Service: mongoose.model('service', serviceSchema)
}


