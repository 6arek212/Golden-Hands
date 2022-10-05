module.exports = {
    // method of operation
    post: {
        tags: ["Workers"], // operation's tag.
        description: "Insert Worker Service", // operation's desc.
        operationId: "insertWorkerService", // unique operation id.
        parameters: [

            {
                name: "worker", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "worker Id", // short desc.
                required: true
            },

            {
                name: "title", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "service title", // short desc.
                required: true
            },


            {
                name: "price", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "service price", // short desc.
                required: true
            },


        ], // expected params.
        // expected responses
        responses: {
            // response code
            201: {
                description: "insert Worker Service success",
                content: {
                    // content-type
                    "application/json": {


                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "service inserted",
                                },
                                "service": {
                                    $ref: "#/components/schemas/Service"
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
                                    example: "service can only be added for worker users",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};