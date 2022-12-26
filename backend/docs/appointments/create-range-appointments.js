

module.exports = {
  // method of operation
  post: {
    tags: ["Appointments"], // operation's tag.
    description: "Create Range Appointments", // operation's desc.
    operationId: "createRangeAppointments", // unique operation id.
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
        name: "duration", 
        in: "body", 
        schema: {
          type: "number",
        },
        description: "the appointments duration in minutes", 
        example: "30",
        required: true
      }

    ], 
    // expected responses
    responses: {
      // response code
      201: {
        description: "create range appointments",
        content: {
          // content-type
          "application/json": {


            "schema": {
              "type": "object",

              "properties": {
                "message": {
                  type: "string",
                  description: "message",
                  example: "appointments created",
                },
                "appointments": {
                  "type": "array",
                  "items": {
                      $ref: "#/components/schemas/Appointment"
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