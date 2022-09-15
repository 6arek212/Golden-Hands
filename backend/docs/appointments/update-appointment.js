

module.exports = {
    // method of operation
    patch: {
        tags: ["Appointments CRUD"], // operation's tag.
        description: "Update Appointment", // operation's desc.
        operationId: "updateAppointment", // unique operation id.
        parameters: [
            {
                name: "appointmentId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string",
                    description: "appointment Id", // short desc.
                },
                required: true
            }

        ], // expected params.
        // expected responses
        responses: {
            // response code
            201: {
                description: "Update appointment ",
                content: {
                    // content-type
                    "application/json": {


                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "appointment updated",
                                },
                                "appointment": {
                                    $ref: "#/components/schemas/Appointment"
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
                                    example: "this appointment has already been booked, unbook it first",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};