
module.exports = {
    // method of operation
    get: {
        tags: ["Appointments"], // operation's tag.
        description: "Get Available Appointments", // operation's desc.
        operationId: "getAvailableAppointments", // unique operation id.
        parameters: [
            {
                name: "workerId", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
                description: "Worker Id", // short desc.
                required: true
            },
            {
                name: "workingDate", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
                description: "The working date"
            },

            {
                name: "fromDate", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
                description: "start date"
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
                                "availableAppointments": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/Appointment"
                                    },
                                    "describtion": "available appointments"
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