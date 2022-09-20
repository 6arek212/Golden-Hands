const sharp = require("sharp");
const fs = require("fs");
const path = require('path')


module.exports.reduceImageSize = async (req, res, next) => {
    fs.access(path.join(__dirname, '..', 'imgs'), (error) => {
        if (error) {
            fs.mkdirSync(path.join(__dirname, '..', 'imgs'));
        }
    })

    try {
        const user = req.user
        const { buffer, originalname } = req.file;
        const ref = `${user}${path.extname(originalname)}`;
        req.file.filename = ref

        if (req.file.buffer.length == 0) {
            return res.status(400).json({
                message: 'image cant be empty'
            })
        }


        await sharp(buffer, { failOnError: false })
            .webp({ quality: 100 })
            .withMetadata()
            .resize(960, 960)
            .rotate()
            .toFile(path.join(__dirname, '..', 'imgs', ref));

        next()
    } catch (e) {
        console.log('error while compression', e);
        res.status(400).json({
            message: 'error uploading'
        })
    }
}