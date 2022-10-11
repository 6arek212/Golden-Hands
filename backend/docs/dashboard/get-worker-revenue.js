
module.exports = {
    // method of operation
    get: {
        tags: ["Dashboard"], // operation's tag.
        description: "Get Worker Daily Revenue", // operation's desc.
        operationId: "getWorkerRevenue", // unique operation id.
        parameters: [
            {
                name: "workerId",
                in: "query",
                schema: {
                    type: "string"
                },
                description: "worker Id", // short desc.
            },
        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Get Worker Daily Revenue",
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

                                "data": {
                                    "type": "array",
                                    "items": {
                                        type: 'object',
                                        properties: {
                                            worker: {
                                                $ref: "#/components/schemas/User",
                                            },
                                            workingDate: {
                                                type: "string"
                                            },
                                            revenue: {
                                                type: "number"
                                            },
                                            year: {
                                                type: "number"
                                            },
                                            month: {
                                                type: "number"
                                            },
                                            count: {
                                                type: "number"
                                            }
                                        }
                                    },
                                    "describtion": "The data"
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