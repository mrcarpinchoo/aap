'use strict';

const express = require('express');
const { nanoid } = require('nanoid');
const dbPet = require('../../db/models/Pet');
const { authorize } = require('../middleware/userMiddleware');

const router = express.Router();

const NANOID_SIZE = 10;

router.post('/', authorize, async (req, res) => {
    const {
        name,
        description,
        breed,
        age,
        ownerEmail,
        weight,
        location,
        character,
        conditions,
        vaccinations
    } = req.body;

    const petData = {
        uuid: nanoid(NANOID_SIZE),
        name,
        description,
        breed,
        age,
        ownerEmail,
        weight,
        location,
        character,
        conditions,
        vaccinations
    };

    try {
        const pet = await dbPet.createPet(petData);
        res.status(201).json(pet);
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    const { breed, conditions, age, character, location, ownerEmail } = req.query;

    const filters = {};

    if (breed) {
        filters.breed = breed;
    }
    if (conditions) {
        filters.conditions = conditions;
    }
    if (age) {
        filters.age = age;
    }
    if (character) {
        filters.character = character;
    }
    if (location) {
        filters.location = location;
    }
    if (ownerEmail) {
        filters.ownerEmail = ownerEmail;
    }

    try {
        const pets = await dbPet.find(filters);

        res.json(pets);
    } catch (error) {
        console.error('Error getting pets by filters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        const pet = await dbPet.findOne({ uuid });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        console.error('Error getting pet by UUID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:uuid', authorize, async (req, res) => {
    const petUuid = req.params.uuid;

    try {
        const existingPet = await dbPet.findOne({ uuid: petUuid });
        if (!existingPet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
    } catch (error) {
        console.error('Error finding pet:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const requiredAttributes = [
        'name',
        'description',
        'breed',
        'age',
        'ownerEmail',
        'weight',
        'location',
        'character',
        'conditions',
        'vaccinations'
    ];
    const missingAttributes = requiredAttributes.filter(
        attr => !req.body[attr]
    );
    if (missingAttributes.length > 0) {
        return res
            .status(400)
            .json({
                error: `Missing attributes: ${missingAttributes.join(', ')}`
            });
    }

    try {
        const updatedPet = await dbPet.updatePet(petUuid, req.body);
        return res.status(200).json(updatedPet);
    } catch (error) {
        console.error('Error updating pet:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:uuid', authorize, async (req, res) => {
    const { uuid } = req.params;
    try {
        const deletedPet = await dbPet.deletePet(uuid);
        if (!deletedPet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.json(deletedPet);
    } catch (error) {
        console.error('Error deleting pet by UUID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
