module.exports = {
    // method of operation
    get: {
        tags: ["Workers"], // operation's tag.
        description: "get Worker Service", // operation's desc.
        operationId: "getWorkerService", // unique operation id.
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
                description: "get Worker Services",
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
                                "services": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/Service"
                                    },
                                },
                            }
                        }
                    },


                },
            },
        },
    },
};