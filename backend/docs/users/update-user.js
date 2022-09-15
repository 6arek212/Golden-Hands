

module.exports = {
    // method of operation
    patch: {
        tags: ["Users"], // operation's tag.
        description: "Update User", // operation's desc.
        operationId: "updateUser", // unique operation id.
        parameters: [
            {
                name: "userId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string"
                },
                description: "user Id", // short desc.
                required: true
            }
        ], // expected params.
        // expected responses
        responses: {
            // response code
            201: {
                description: "Update appointment ",
                content: {
                    // content-type
                    "application/json": {


                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "user updated",
                                },
                                "user": {
                                    $ref: "#/components/schemas/User"
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
                                    example: "user was not found",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};