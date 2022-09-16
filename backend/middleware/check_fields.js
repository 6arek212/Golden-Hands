


module.exports = (paramNameType , required_fileds) => {
    if (!Array.isArray(required_fileds))
        throw 'must send an array !'

    return (req, res, next) => {

        // console.log(req[paramNameType]);

        for (field of required_fileds.values()) {
            if (!req[paramNameType][field]) {
                console.log(`parameter ${field} was not provided on request ${paramNameType}!`);
                return res.status(400).json({
                    message: `parameter ${field} was not provided on request ${paramNameType}!`
                })
            }
        }
        next()
    }
}


