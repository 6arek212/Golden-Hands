

module.exports = {
  // method of operation
  post: {
    tags: ["Appointments"], // operation's tag.
    description: "Create Appointment", // operation's desc.
    operationId: "createAppointment", // unique operation id.
    parameters: [

      {
        name: "worker", // name of param
        in: "body", // location of param
        schema: {
          type: "string"
        },
        description: "worker Id", // short desc.
        required: true
      },
      {
        name: "start_time", // name of param
        in: "body", // location of param
        schema: {
          type: "date"
        },
        description: "start time for the appointment", // desc
        example: "2022-09-15 13:00:00",
        required: true
      },
      {
        name: "end_time", // name of param
        in: "body", // location of param
        schema: {
          type: "date"
        },
        description: "start time for the appointment", // desc
        example: "2022-09-15 13:00:00",
        required: true
      },
      {
        name: "hold", // name of param
        in: "body", // location of param
        schema: {
          type: "bool"
        },
        description: "make a holded appointment , preventing from beeing booked until the worker allows it", 
        example: 'true'
      }

    ], 
    // expected responses
    responses: {
      // response code
      201: {
        description: "create appointment ",
        content: {
          // content-type
          "application/json": {


            "schema": {
              "type": "object",

              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "appointment created",
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
                  example: "appointments conflicting",
                }
              },

            }
          }
        }
      }

    },
  },
};