

module.exports = {
  // method of operation
  post: {
    tags: ["Appointments"], // operation's tag.
    description: "unBook Appointment", // operation's desc.
    operationId: "unbookAppointment", // unique operation id.
    parameters: [
      {
        name: "appointmentId", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "appointment Id ", // short desc.
        required: true
      }
    ], 

    responses: {
      // response code
      201: {
        description: "unbook appointment ",
        content: {
          // content-type
          "application/json": {


            "schema": {
              "type": "object",

              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "appointment unbooked !",
                }
              }
            }
          },


        },
      },


      403: {

        content: {
          "application/json": {
            schema: {
              "type": "object",
              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "you\'r not authorized to unbook this appointment",
                }
              },

            }
          }
        }
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
                  example: "appointment is not booked !",
                }
              },

            }
          }
        }
      }

    },
  },
};