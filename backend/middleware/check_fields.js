


module.exports = (required_fileds) => {
    if (!Array.isArray(required_fileds))
        throw 'must send an array !'
    return (req, res, next) => {

        console.log(req.body);

        for (field of required_fileds.values()) {
            if (!req.body[field]) {
                console.log('required fileds failed');
                return res.status(400).json({
                    message: `parameter ${field} was not provided !`
                })
            }
        }
        next()
    }
}


