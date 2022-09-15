
module.exports = {
    // method of operation
    get: {
        tags: ["Working Dates"], // operation's tag.
        description: "Get Working Dates", // operation's desc.
        operationId: "getWorkingDates", // unique operation id.
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

            {
                name: "fromDate", // name of param
                in: "param", // location of param
                schema: {
                    type: "date"
                },
                description: "starting date", // short desc.
                example: "2022-09-15 13:00:00",
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
                                "workingDates": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/WorkingDate"
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