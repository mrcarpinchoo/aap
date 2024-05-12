const Pet = require('../../db/models/Pet');

const checkPetExistenceInDb = async (req, res, next) => {
    const { petUuid } = req.params;
    try {
        const pet = await Pet.findPetByUuid(petUuid);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        next();
    } catch (error) {
        console.error('Error checking pet existence:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkPetExistenceInDb };
