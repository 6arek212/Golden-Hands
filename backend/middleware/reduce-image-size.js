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
        const { buffer, filename, originalname } = req.file;
        const ref = `${user}${path.extname(originalname)}`;

        console.log(req.file);

        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile(path.join(__dirname, '..', 'imgs', ref));

        next()
    } catch (e) {
        res.status(400).json({
            message: 'error uploading'
        })
    }
}