'use strict';

// Imports
// project modules
const mongoose = require('../connection');

// wishlist schema
const wishlistSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    pets: [
        {
            type: String,
            ref: 'Pet',
            default: []
        }
    ]
});

// Wishlist CRUD operations -----
// create
wishlistSchema.statics.createWishlist = async wishlistData => {
    try {
        return await dbWishlist(wishlistData).save();
    } catch (err) {
        throw new Error(err.message2004);
    }
};

// read
/**
 * Returns the wishlist of the user.
 * @param {string} ID ID of the user in the database.
 * @returns {object} Whishlist instance.
 */
wishlistSchema.statics.getWishlistByID = async id => {
    try {
        return await dbWishlist.findById(id);
    } catch (err) {
        throw new Error(err.message);
    }
};

wishlistSchema.statics.getWishlists = async filter => {
    try {
        return await dbWishlist.find(filter);
    } catch (err) {
        throw new Error(err.message);
    }
};

// update
wishlistSchema.statics.addPetToWishlist = async (wishlistID, petUUID) => {
    try {
        return await dbWishlist.findByIdAndUpdate(
            wishlistID,
            { $push: { pets: petUUID } },
            { new: true }
        ); // returns the updated wishlist object
    } catch (err) {
        throw new Error(err.message);
    }
};

wishlistSchema.statics.removePetFromWishlist = async (wishlistID, petUUID) => {
    try {
        return await dbWishlist.findByIdAndUpdate(
            wishlistID,
            { $pull: { pets: petUUID } },
            { new: true }
        ); // returns the updated wishlist object
    } catch (err) {
        throw new Error(err.message);
    }
};

// delete
wishlistSchema.statics.deleteWishlist = async id => {
    try {
        return await dbWishlist.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(err.message);
    }
};

const dbWishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = dbWishlist;
