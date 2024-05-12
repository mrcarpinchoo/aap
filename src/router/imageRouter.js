'use strict';

const express = require('express');
const Image = require('../../db/models/Image');
const { checkPetExistenceInDb } = require('../middleware/petMiddleware');
const { authorize } = require('../middleware/userMiddleware');

const router = express.Router();

router.post('/:petUuid', authorize, checkPetExistenceInDb, async (req, res) => {
    const { name, url, description, binary } = req.body;
    const { petUuid } = req.params;

    if (!name || !description || !url || !binary) {
        res.status(400).json({ error: 'Missing attributes' });
        return;
    }

    const imageData = {
        name,
        url,
        description,
        binary,
        petUuid
    };

    try {
        const image = await Image.createImage(petUuid, imageData);
        res.status(201).json(image);
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const images = await Image.find();

        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:petUuid', checkPetExistenceInDb, async (req, res) => {
    try {
        const images = await Image.findImagesByPetUuid(req.params.petUuid);
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/image/:imageId', async (req, res) => {
    const { imageId } = req.params;

    try {
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/image/:imageId', authorize, async (req, res) => {
    const { imageId } = req.params;

    try {
        const deletedImage = await Image.findByIdAndDelete(imageId);

        if (!deletedImage) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
