

module.exports = {
  // method of operation
  post: {
    tags: ["Working Dates"], // operation's tag.
    description: "Create Working Dates", // operation's desc.
    operationId: "createWorkingDates", // unique operation id.
    parameters: [
      {
        name: "workerId", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "worker Id", // short desc.
        required: true
      },
      {
        name: "date", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "the wroking date", // desc
        example: "2022-09-15 13:00:00",
        required: true
      },

    ], // expected params.
    // expected responses
    responses: {
      // response code
      201: {
        description: "create working date",
        content: {
          // content-type
          "application/json": {


            "schema": {
              "type": "object",

              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "insert working date success",
                },
                "workingDate": {
                  $ref: "#/components/schemas/WorkingDate"
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
                  example: "You have already added a working date in this date",
                }
              },

            }
          }
        }
      }

    },
  },
};