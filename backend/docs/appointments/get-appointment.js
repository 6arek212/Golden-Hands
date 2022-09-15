module.exports = {
    // method of operation
    get: {
        tags: ["Appointments CRUD"], // operation's tag.
        description: "Get Appointment", // operation's desc.
        operationId: "getAppointment", // unique operation id.
        parameters: [], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Appointments were obtained",
                content: {
                    // content-type
                    "application/json": {

                        data: {
                            message: {
                                $ref: "#/components/schemas/Message",
                            },


                            schema: {
                                $ref: "#/components/schemas/Appointment",
                            },
                        }




                    },
                },
            },
        },
    },
};