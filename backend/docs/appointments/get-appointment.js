module.exports = {
    // method of operation
    get: {
        tags: ["Appointments"], // operation's tag.
        description: "Get Appointment", // operation's desc.
        operationId: "getAppointment", // unique operation id.
        parameters: [

            {
                name: "appointmentId", // name of param
                in: "param", // location of param
                schema: {
                    type: "string"
                },
                description: "appointment Id", // short desc.
                require: true
            },

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Fetch Appointment",
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
                                "appointment": {
                                    $ref: "#/components/schemas/Appointment"
                                },
                            }
                        }
                    },


                },
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
                                    example: "Appointment was not found", 
                                }
                            },
                          
                        }
                    }
                }
            }

        },
    },
};