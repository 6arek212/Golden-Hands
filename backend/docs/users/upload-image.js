module.exports = {
    // method of operation
    post: {
        tags: ["Users"], // operation's tag.
        description: "Upload user image", // operation's desc.
        operationId: "uploadUserImage", // unique operation id.
        parameters: [
            {
                in: "formData", // location of param
                name: "image", // name of param
                schema: {
                    type: "file"
                },
                description: "The image to upload", // short desc.
                required: true
            },
        ], // expected params.
        // expected responses
        responses: {
            // response code
            201: {
                description: "Upload user image",
                content: {
                    // content-type
                    "application/json": {
                        "schema": {
                            "type": "object",

                            "properties": {
                                "message": {
                                    type: "string",
                                    description: "message",
                                    example: "image uploaded",
                                }
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
                                    example: "Bad request",
                                }
                            },

                        }
                    }
                }
            }

        },
    },
};