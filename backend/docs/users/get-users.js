
module.exports = {
    // method of operation
    get: {
        tags: ["Users"], // operation's tag.
        description: "Get Users", // operation's desc.
        operationId: "getUsers", // unique operation id.
        parameters: [
            {
                name: "search", // name of param
                in: "query", // location of param
                schema: {
                    type: "string"
                },
                description: "the search string, by phone or a name", // short desc.
            },

            {
                name: "currentPage", // name of param
                in: "query", // location of param
                schema: {
                    type: "number"
                },
                description: "current page number", // short desc.
            },

            {
                name: "pagesize", // name of param
                in: "query", // location of param
                schema: {
                    type: "number"
                },
                description: "page size number", // short desc.
            },

            {
                name: "sort", // name of param
                in: "param", // location of param
                schema: {
                    type: "number"
                },
                description: "sort the data , 1 for 'asc' -1 for 'desc'", // short desc.
            },

        ], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Users fetch",
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
                                "users": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/User"
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