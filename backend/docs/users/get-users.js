
module.exports = {
    // method of operation
    get: {
        tags: ["Users"], // operation's tag.
        description: "Get Users", // operation's desc.
        operationId: "getUsers", // unique operation id.
        parameters: [

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Users fetch",
                content: {
                    // content-type
                    "application/json": {
                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "fetch success",
                                },
                                "users": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/User"
                                    },
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
                                    example: "Bad request response",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};