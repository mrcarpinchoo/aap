'use strict';

// Imports
// libraries
const express = require('express');
const { nanoid } = require('nanoid');

// project modules
const {
    validateReqBody,
    checkEmailExistence,
    createWishlist,
    authorize,
    validateReqBodyForUpdate
} = require('../middleware/userMiddleware');
const dbPet = require('../../db/models/Pet');
const dbUser = require('../../db/models/User');
const dbWishlist = require('../../db/models/Wishlist');
const { signToken } = require('../utils');

const NANOID_SIZE = 10;

const router = express.Router();

// GET requests
router.get('/', authorize, async (req, res) => {
    try {
        const user = await dbUser.getUserByID(req.user._id);

        return res.status(200).send(user);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

// POST requests
// registers a new user
router.post(
    '/',
    validateReqBody,
    checkEmailExistence,
    createWishlist,
    async (req, res) => {
        const { name, location, email, password } = req.body;

        try {
            const {
                _id,
                uuid,
                email: $email
            } = await dbUser.createUser({
                uuid: nanoid(NANOID_SIZE),
                name,
                location,
                email,
                password,
                wishlistID: req.wishlistID
            });

            const token = signToken(_id, uuid, $email);

            return res.status(201).send({ token });
        } catch (err) {
            return res.status(500).send({ err: err.message });
        }
    }
);

// PUT requests
// updates user information
router.put('/', authorize, validateReqBodyForUpdate, async (req, res) => {
    const { name, location } = req.body;

    try {
        const updatedUser = await dbUser.updateUser(req.user._id, {
            name,
            location
        });

        return res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

// DELETE requests
router.delete('/', authorize, async (req, res) => {
    try {
        const { wishlistID } = await dbUser.getUserByID(req.user._id);

        req.user.wishlistID = wishlistID;
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

    try {
        await dbWishlist.deleteWishlist(req.user.wishlistID);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

    // when the owner is deleted, removes their pets from other wishlists
    try {
        const ownerPets = await dbPet.getPetsByOwner(req.user.email);

        for (const pet of ownerPets) {
            const petUUID = pet.uuid;
            const wishlists = await dbWishlist.getWishlists({ pets: petUUID });

            for (const wishlist of wishlists)
                await dbWishlist.removePetFromWishlist(wishlist._id, petUUID);
        }
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

    // removes all pets from wishlist on user deletion
    try {
        await dbPet.deletePetsOnUserDeletion(req.user.email);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

    try {
        const deletedUser = await dbUser.deleteUser(req.user._id);

        return res.status(200).send(deletedUser);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

module.exports = router;
