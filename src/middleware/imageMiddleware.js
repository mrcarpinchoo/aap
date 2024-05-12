const dbImage = require('../../db/models/Image');

const checkImageExistenceInDb = async (req, res, next) => {
    const { imageUrl } = req.body;
    try {
        const image = await dbImage.findOne({ url: imageUrl });
        if (!image) {
            return res.status(400).json({ error: 'Image does not exist' });
        }
        next();
    } catch (error) {
        console.error('Error checking image existence:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkImageExistenceInDb };
