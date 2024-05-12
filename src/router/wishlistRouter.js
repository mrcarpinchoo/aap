'use strict';

// Imports
// libraries
const express = require('express');

// project modules
const { authorize } = require('../middleware/wishlistMiddleware');
const {
    getWishlistByID,
    checkExistenceInWishlist
} = require('../middleware/wishlistMiddleware');
const dbWishlist = require('../../db/models/Wishlist');

const router = express.Router();

// GET requests
// retrieves user wishlist
router.get('/my-wishlist', authorize, getWishlistByID, async (req, res) => {
    return res.status(200).send(req.wishlist);
});

// PUT requests
// adds a pet to the user wishlist
router.put(
    '/my-wishlist/add/:petUUID',
    authorize,
    getWishlistByID,
    checkExistenceInWishlist,
    async (req, res) => {
        const { _id: wishlistID } = req.wishlist;
        const { petUUID } = req.params;

        if (req.isPetInWishlist)
            return res.status(409).send({ err: 'Pet is already in wishlist' });

        try {
            const wishlist = await dbWishlist.addPetToWishlist(
                wishlistID,
                petUUID
            ); // returns the updated wishlist object

            return res.status(200).send(wishlist);
        } catch (err) {
            return res.status(500).send({ err });
        }
    }
);

// removes a pet from the user wishlist
router.put(
    '/my-wishlist/remove/:petUUID',
    authorize,
    getWishlistByID,
    checkExistenceInWishlist,
    async (req, res) => {
        const { _id: wishlistID } = req.wishlist;
        const { petUUID } = req.params;

        if (!req.isPetInWishlist)
            return res.status(409).send({ err: 'Pet is not in wishlist' });

        try {
            const wishlist = await dbWishlist.removePetFromWishlist(
                wishlistID,
                petUUID
            ); // returns the updated wishlist object

            return res.status(200).send(wishlist);
        } catch (err) {
            return res.status(500).send({ err });
        }
    }
);

module.exports = router;
