var request = require('request');
const https = require('https');

//'code2' | 'appointment_approaching'

const whatsapp = () => {

    return {
        sendMessage: (phone, template, parameters = null) => {

            console.log(phone, template, parameters);
            const options = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": phone,
                "type": "template",
                "template": {
                    "name": template,
                    "language": {
                        "code": "HE"
                    },
                    "components": [
                        {
                            "type": "body",
                            parameters: parameters
                        }
                    ]
                }
            }

            request.post(`https://graph.facebook.com/v14.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                        'Accept': '*/*'
                    },
                    body: JSON.stringify(options)
                },
                (err, res, body) => {
                    console.log(err, body);
                })
        }
    }
}

module.exports = whatsapp()