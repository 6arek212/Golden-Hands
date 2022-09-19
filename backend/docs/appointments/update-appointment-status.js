

module.exports = {
    // method of operation
    patch: {
        tags: ["Appointments"], // operation's tag.
        description: "Update Appointment Status", // operation's desc.
        operationId: "updateAppointmentStatus", // unique operation id.
        parameters: [
            {
                name: "appointmentId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string",
                    description: "appointment Id", // short desc.
                },
                required: true
            },

            {
                name: "status", // name of param
                in: "param", // location of param
                schema: {
                    type: "string",
                    description: "the appointment status , if its free then the appointment must be unbooked first", // short desc.
                },
                required: true,
                example: "'done', 'in-progress', 'didnt-come', 'canceled' , 'free' , 'hold'"
            }

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "appointment status update",
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
                                    example: "the appointment is booked, You can change the status to done , in-progress , didnt-come , canceled",
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
                                    example: "appointment was not found",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};