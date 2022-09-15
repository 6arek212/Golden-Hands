module.exports = {
  // method of operation
  delete: {
    tags: ["Users"], // operation's tag.
    description: "Delete User", // operation's desc.
    operationId: "deleteUser", // unique operation id.
    parameters: [

      {
        name: "userId", // name of param
        in: "param", // location of param
        schema: {
          type: "string"
        },
        description: "user Id", // short desc.
        require: true
      },

    ], // expected params.
    // expected responses
    responses: {
      // response code
      200: {
        description: "Delete User",
        content: {
          // content-type
          "application/json": {

            schema: {
              "type": "object",
              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "user deleted",
                }
              },
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
                  example: "user was not found",
                }
              },

            }
          }
        }
      }

    },
  },
};