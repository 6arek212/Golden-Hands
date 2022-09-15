module.exports = {
    // method of operation
    post: {
        tags: ["Auth"], // operation's tag.
        description: "Send Verification Message", // operation's desc.
        operationId: "sendAuthVerification", // unique operation id.
        parameters: [
            {
                name: "phone", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "phone number", // short desc.
                required: true
            },
        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Fetch User",
                content: {
                    // content-type
                    "application/json": {


                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "verification sent",
                                },
                                "verifyId": {
                                    type: "string",
                                    description: "message",
                                    example: "SDFVXCVDERSDFXZCVSD",
                                },
                            }
                        }
                    },


                },
            },


            400: {

                content: {
                    "application/json": {
                        schema: {
                            "type": "object",
                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "Bad Request",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};