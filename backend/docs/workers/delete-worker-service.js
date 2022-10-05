module.exports = {
    // method of operation
    delete: {
        tags: ["Workers"], // operation's tag.
        description: "delete Worker Service", // operation's desc.
        operationId: "deleteWorkerService", // unique operation id.
        parameters: [

            {
                name: "serviceId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string"
                },
                description: "service Id", // short desc.
                required: true
            }

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
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
                                    example: "service was deleted",
                                }
                            }
                        }
                    },


                },
            },


            403: {

                content: {
                    "application/json": {
                        schema: {
                            "type": "object",
                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "your not allowd to delete service for another worker",
                                }
                            },

                        }
                    }
                }
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
                                    example: "service was not found",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};