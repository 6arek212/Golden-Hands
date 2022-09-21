
module.exports = {
    // method of operation
    get: {
        tags: ["Dashboard"], // operation's tag.
        description: "Get Stats", // operation's desc.
        operationId: "getStats", // unique operation id.
        parameters: [

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

                                "customersCount": {
                                    type: "int",
                                    description: "customer number",
                                    example: "599",
                                },

                                "appointmentsCount": {
                                    type: "int",
                                    description: "appointments number",
                                    example: "34",
                                },


                                "doneAppointmentsCount": {
                                    type: "int",
                                    description: "appointments number",
                                    example: "133",
                                },


                                "pendingAppointmentsCount": {
                                    type: "int",
                                    description: "appointments number",
                                    example: "30",
                                },


                                "canceledAppointmentsCount": {
                                    type: "int",
                                    description: "appointments number",
                                    example: "2",
                                },

                                "newCustomers": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/User"
                                    },
                                    "describtion": "The lastest joined customers"
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