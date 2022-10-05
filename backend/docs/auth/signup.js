module.exports = {
    // method of operation
    post: {
        tags: ["Auth"], // operation's tag.
        description: "Signup , Only for super user , No verification required", // operation's desc.
        operationId: "signup", // unique operation id.
        parameters: [
            {
                name: "phone", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "phone number", // short desc.
                required: true
            },
            {
                name: "firstName", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "First Name", // short desc.
                required: true
            },
            {
                name: "lastName", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "Last Name", // short desc.
                required: true
            },

            {
                name: "birthDate", // name of param
                in: "body", // location of param
                schema: {
                    type: "string"
                },
                description: "Birth Date", // short desc.
                required: true
            },
            {
                name: "role",
                in: "body",
                schema: {
                    type: "string"
                },
                description: "the user role 'customer' , 'barber'", // short desc.
                required: true
            }
        ],
        // expected responses
        responses: {
            // response code
            201: {
                description: "Signup With no phone verification required",
                content: {
                    // content-type
                    "application/json": {


                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "signup sucess",
                                },
                                "authData": {
                                    type: "object",
                                    properties: {
                                        "user": {
                                            $ref: "#/components/schemas/User"
                                        },
                                        token: {
                                            type: "string",
                                            description: "access token",
                                            example: "SDFVGDFVBERVSDVCASCASCZXCSDFSDVSDFVSDVSDAVSDVSDVSDV",
                                        },
                                        refresh_token: {
                                            type: "string",
                                            description: "refresh access token",
                                            example: "SDFVGDFVBERVSDVCASCASCZXCSDFSDVSDFVSDVSDAVSDVSDVSDV",
                                        }
                                    }
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
                                    example: "Bad Request",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};