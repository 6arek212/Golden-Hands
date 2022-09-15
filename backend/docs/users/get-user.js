module.exports = {
    // method of operation
    get: {
        tags: ["Users"], // operation's tag.
        description: "Get User", // operation's desc.
        operationId: "getUser", // unique operation id.
        parameters: [

            {
                name: "userId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string"
                },
                description: "user Id", // short desc.
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
                                    example: "fetch success",
                                },
                                "user": {
                                    $ref: "#/components/schemas/User"
                                },
                            }
                        }
                    },


                },
            },


            404: {

                content: {
                    "application/json": {
                        schema: {
                            "type": "object",
                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "User was not found",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};