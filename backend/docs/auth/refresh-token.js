module.exports = {
    // method of operation
    post: {
        tags: ["Auth"], // operation's tag.
        description: "Refresh Token", // operation's desc.
        operationId: "refresh Token", // unique operation id.
        parameters: [
            {
                name: "refreshToken", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "Refresh Token", // short desc.
                required: true
            }
        ],
        // expected responses
        responses: {
            // response code
            200: {
                description: "Refresh Token",
                content: {
                    // content-type
                    "application/json": {

                        "schema": {
                            "type": "object",

                            "properties": {
                                message: {
                                    type: "string",
                                    description: "message",
                                    example: "token refreshed",
                                },
                                token: {
                                    type: "string",
                                    description: "refresh token",
                                    example: "SDFVGDFVBERVSDVCASCASCZXCSDFSDVSDFVSDVSDAVSDVSDVSDV",
                                }
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