

module.exports = {
  // method of operation
  post: {
    tags: ["Appointments"], // operation's tag.
    description: "Book Appointment", // operation's desc.
    operationId: "bookAppointment", // unique operation id.
    parameters: [
      {
        name: "appointmentId", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "appointment Id ", // short desc.
        required: true
      },
      {
        name: "userId", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "user Id", // desc
        example: "DFGERGERG354GDFB56BFGN",
        required: true
      },
      {
        name: "service", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "service", // desc
        example: "Hair Cut",
        required: true
      }

    ],

    responses: {
      // response code
      201: {
        description: "book appointment ",
        content: {
          // content-type
          "application/json": {


            "schema": {
              "type": "object",

              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "appointment booked !",
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
                  example: "appointment has already been booked",
                }
              },

            }
          }
        }
      }

    },
  },
};