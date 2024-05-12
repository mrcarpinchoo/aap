'use strict';

const Pet = require('./Pet');
const mongoose = require('../connection');

const messageSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: false
    },
    date: {
        type: mongoose.Schema.Types.Number,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    petUuid: {
        type: String,
        required: false
    }
});

messageSchema.statics.createMessage = async function (petUuid, messageData) {
    try {
        if (typeof petUuid !== 'string') {
            throw new Error('petUuid must be a string');
        }

        const newMessage = new this(messageData);
        const doc = await newMessage.save();
        await Pet.addMessage(petUuid, doc._id);
        return doc;
    } catch (error) {
        console.error('Error saving message:', error);
        throw new Error('Error saving message: ' + error.message);
    }
};

messageSchema.statics.findMessagesByPetUuid = async function (petUuid) {
    try {
        const messages = await this.find({ petUuid });
        return messages;
    } catch (error) {
        throw new Error(
            'Error fetching messages by pet UUID: ' + error.message
        );
    }
};

const dbMessage = mongoose.model('Message', messageSchema);

module.exports = dbMessage;
