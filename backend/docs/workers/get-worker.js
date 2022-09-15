module.exports = {
    // method of operation
    get: {
        tags: ["Workers"], // operation's tag.
        description: "Get Worker", // operation's desc.
        operationId: "getWorker", // unique operation id.
        parameters: [

            {
                name: "workerId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string"
                },
                description: "worker Id", // short desc.
                required: true
            },

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Fetch Worker Data",
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
                                "appointment": {
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
                                    example: "Worker was not found",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};