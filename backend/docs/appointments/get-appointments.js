
module.exports = {
    // method of operation
    get: {
        tags: ["Appointments"], // operation's tag.
        description: "Get Appointments", // operation's desc.
        operationId: "getAppointments", // unique operation id.
        parameters: [
            {
                name: "barber", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
                description: "barber Id", // short desc.
            },
            {
                name: "service", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
            },

            {
                name: "start_time", // name of param
                in: "query", // location of param
                schema: {
                    type: "date"
                },
            },

            {
                name: "end_time", // name of param
                in: "query", // location of param
                schema: {
                    type: "date"
                },
            },

            {
                name: "pageSize", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
            },
            {
                name: "currentPage", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
            },

            {
                name: "customerId", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
            },

            {
                name: "sort", // name of param
                in: "query", // location of param
                schema: {
                    type: "string",
                    example:'desc | asc'
                },
            },

            {
                name: "isActive", // name of param
                in: "query", // location of param
                schema: {
                    type: "boolean"
                },
            },

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Appointments were obtained",
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
                                "appointments": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/Appointment"
                                    },
                                    "describtion": "Video ids "
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