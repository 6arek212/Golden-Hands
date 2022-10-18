
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



const twilio = () => {

    return {
        sendMessage: (phone , message) => {
            // Create options to send the message
            const options = {
                to: `+ ${phone}`,
                messagingServiceSid: 'MG91cc7f21e93e935e4de2d16a90c4b45d',
                /* eslint-disable max-len */
                body: message,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function (err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = phone.substr(0,
                        phone.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        }
    }

}

module.exports = twilio()