'use strict';

const Pet = require('./Pet');
const User = require('./User');
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userFirstName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    userCity: {
        type: String,
        required: true
    },
    userState: {
        type: String,
        required: true
    },
    userPostalCode: {
        type: String,
        required: true
    },
    userDirection: {
        type: String,
        required: true
    },
    userAge: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    userCouple: {
        type: String,
        required: true
    },
    userChildrenQty: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    petUuid: {
        type: String,
        required: false
    }
});

requestSchema.statics.createRequest = async function (petUuid, requestData) {
    try {
        if (typeof petUuid !== 'string') {
            throw new Error('petUuid must be a string');
        }

        const newImage = new this(requestData);
        const doc = await newImage.save();
        await Pet.addRequest(petUuid, doc._id);
        return doc;
    } catch (error) {
        console.error('Error saving request:', error);
        throw new Error('Error saving request: ' + error.message);
    }
};

requestSchema.statics.findRequestsByPetUuid = async function (petUuid) {
    try {
        const requests = await this.find({ petUuid });
        return requests;
    } catch (error) {
        throw new Error(
            'Error fetching requests by pet UUID: ' + error.message
        );
    }
};

requestSchema.statics.findRequestById = async function (requestId) {
    try {
        const request = await this.findById(requestId);
        return request;
    } catch (error) {
        throw new Error('Error fetching request by ID: ' + error.message);
    }
};

requestSchema.statics.findRequestByIdAndDelete = async function (requestId) {
    try {
        const deletedRequest = await this.findByIdAndDelete(requestId);

        if (deletedRequest) {
            const pet = await Pet.findOne({ requests: requestId });

            if (pet) {
                const updatedRequests = pet.requests.filter(
                    request => !request.equals(requestId)
                );
                pet.requests = updatedRequests;

                await pet.save();
            }
        }

        return deletedRequest;
    } catch (error) {
        console.error('Error deleting request by ID:', error);
        throw new Error('Internal server error');
    }
};

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
