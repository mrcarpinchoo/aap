'use strict';

const Pet = require('./Pet');
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    binary: {
        type: String,
        required: true
    },
    petUuid: {
        type: String,
        required: true
    }
});

imageSchema.statics.createImage = async function (petUuid, imageData) {
    try {
        if (typeof petUuid !== 'string') {
            throw new Error('petUuid must be a string');
        }

        const newImage = new this(imageData);
        const doc = await newImage.save();
        await Pet.addImage(petUuid, doc._id);
        return doc;
    } catch (error) {
        console.error('Error saving image:', error);
        throw new Error('Error saving image: ' + error.message);
    }
};

imageSchema.statics.findImagesByPetUuid = async function (petUuid) {
    try {
        const images = await this.find({ petUuid });
        return images;
    } catch (error) {
        throw new Error('Error fetching images by pet UUID: ' + error.message);
    }
};

imageSchema.statics.findImageById = async function (imageId) {
    try {
        const image = await this.findById(imageId);
        return image;
    } catch (error) {
        throw new Error('Error fetching image by ID: ' + error.message);
    }
};

imageSchema.statics.findImageByIdAndDelete = async function (imageId) {
    try {
        const deletedImage = await this.findByIdAndDelete(imageId);

        if (deletedImage) {
            const pet = await Pet.findOne({ images: imageId });

            if (pet) {
                const updatedImages = pet.images.filter(
                    image => !image.equals(imageId)
                );
                pet.images = updatedImages;

                await pet.save();
            }
        }

        return deletedImage;
    } catch (error) {
        console.error('Error deleting image by ID:', error);
        throw new Error('Internal server error');
    }
};

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
