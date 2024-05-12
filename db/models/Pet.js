'use strict';

const mongoose = require('../connection');

const petSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    character: {
        type: String,
        required: true
    },
    conditions: {
        type: String,
        required: true
    },
    vaccinations: {
        type: String,
        required: true
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            default: []
        }
    ],
    forum: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
            default: []
        }
    ]
});

petSchema.statics.createPet = async petData => {
    return await dbPet(petData).save();
};

petSchema.statics.findPetByUuid = async function (petUuid) {
    return this.findOne({ uuid: petUuid });
};

petSchema.statics.addImage = async function (petUuid, imageId) {
    try {
        const pet = await this.findOneAndUpdate(
            { uuid: petUuid },
            { $push: { images: imageId } },
            { new: true }
        );
        return pet;
    } catch (error) {
        console.error('Error adding image to pet:', error);
        throw new Error('Error adding image to pet: ' + error.message);
    }
};

petSchema.statics.addMessage = async function (petUuid, messageId) {
    try {
        const pet = await this.findOneAndUpdate(
            { uuid: petUuid },
            { $push: { forum: messageId } },
            { new: true }
        );
        return pet;
    } catch (error) {
        console.error('Error adding message to pet:', error);
        throw new Error('Error adding message to pet: ' + error.message);
    }
};

petSchema.statics.addRequest = async function (petUuid, requestId) {
    try {
        const pet = await this.findOneAndUpdate(
            { uuid: petUuid },
            { $push: { requests: requestId } },
            { new: true }
        );
        return pet;
    } catch (error) {
        console.error('Error adding request to pet:', error);
        throw new Error('Error adding request to pet: ' + error.message);
    }
};

petSchema.statics.updatePet = async function (petUuid, updatedPetData) {
    try {
        const updatedPet = await this.findOneAndUpdate(
            { uuid: petUuid },
            { $set: updatedPetData },
            { new: true }
        );
        return updatedPet;
    } catch (error) {
        console.error('Error updating pet:', error);
        throw new Error('Internal server error');
    }
};

petSchema.statics.deletePet = async function (petUuid) {
    try {
        const deletedPet = await this.findOneAndDelete({ uuid: petUuid });
        return deletedPet;
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw new Error('Internal server error');
    }
};

petSchema.statics.getPetByUUID = async uuid => {
    try {
        return await dbPet.findOne({ uuid });
    } catch (err) {
        throw new Error(err.message);
    }
};

petSchema.statics.getPetsByOwner = async email => {
    try {
        return await dbPet.find({ ownerEmail: email });
    } catch (err) {
        throw new Error(err.message);
    }
};

// deletes all pets whose owner email is ownerEmail
petSchema.statics.deletePetsOnUserDeletion = async email => {
    try {
        return await dbPet.deleteMany({ ownerEmail: email });
    } catch (err) {
        throw new Error(err.message);
    }
};

const dbPet = mongoose.model('Pet', petSchema);

module.exports = dbPet;
