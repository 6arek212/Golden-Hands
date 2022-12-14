module.exports = {
  // method of operation
  delete: {
    tags: ["Appointments"], // operation's tag.
    description: "Delete Appointment", // operation's desc.
    operationId: "deleteAppointment", // unique operation id.
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
        description: "Appointments were obtained",
        content: {
          // content-type
          "application/json": {

            schema: {
              "type": "object",
              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "Appointment deleted",
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