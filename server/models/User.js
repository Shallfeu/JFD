const {Schema, model} = require('mongoose').default

const schema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    completedMeetings: Number,
    image: String,
    profession: {
        type: Schema.Types.ObjectId,
        ref: 'Profession'
    },
    qualities: [{
        type: Schema.Types.ObjectId,
        ref: 'Quality'
    }],
    sex: {
        type: String,
        enum:['male', 'female', 'other']
    },
    rate: Number
}, {
    timestamps: true
})

module.exports = model('User', schema)