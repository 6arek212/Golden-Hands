module.exports = {
    components: {
        schemas: {
            // id model
            User: {
                type: "object",
                properties: {
                    _id: {
                        type: "string", // data-type
                        description: "User identification number", // desc
                        example: "ASDFERGXCVSADF234ASCADSXC34TRFRGV", // example of an id
                    },
                    firstName: {
                        type: "string",
                        required: true,
                        example: "tarik",
                        description: "First Name"
                    },
                    lastName: {
                        type: "string",
                        required: true,
                        example: "husin",
                        description: "Last Name"
                    },

                    phone: {
                        type: "string",
                        required: true,
                        unique: true,
                        example: "0525145544",
                        description: "Phone Number"
                    },
                    birthDate: {
                        type: "date",
                        required: true,
                        example: "1998-06-10",
                        description: "Birth Date"
                    },
                    role: {
                        type: "string",
                        required: true,
                        default: 'customer',
                        example: "barber",
                        description: "User Role"
                    },
                    image: {
                        type: "string",
                        example: "FDSGBERFDVMXCDFB.jpg",
                        description: "User Image"
                    }

                }
            }
            ,
            // todo model
            Appointment: {
                type: "object", // data type
                properties: {
                    _id: {
                        type: "string", // data-type
                        description: "Appoitnemnt identification number", // desc
                        example: "ASDFERGXCVSADF234ASCADSXC34TRFRGV", // example of an id
                    },
                    customer: {
                        $ref: '#/components/schemas/User',
                        type: "User", // data-type
                        description: "Todo's title", 
                    },
                    worker: {
                        $ref: '#/components/schemas/User',
                        type: "User", // data type
                        description: "The status of the todo", 
                        required: true
                    },
                    workingDate: {
                        type: "date",
                        description: "The actuale Working Date", 
                        example: "2022-09-15 00:00:00",
                        required: true
                    },
                    start_time: {
                        type: "date",
                        description: "start time for the appointment", 
                        example: "2022-09-15 13:00:00",
                        required: true
                    },
                    end_time: {
                        type: "date",
                        description: "end time for the appointment", 
                        example: "2022-09-15 14:00:00",
                        required: true
                    },

                    service: {
                        type: "string",
                        description: "appointment service", // desc
                        example: "Hair cut",
                    },

                    isActive: {
                        type: "boolean",
                        description: "indicates if the appointment is active", // desc
                        example: "true",
                        default: 'true'
                    },
                },
            },
            WorkingDate: {
                type: "object", // data type
                properties: {
                    worker: {
                        $ref: '#/components/schemas/User',
                        description: "the worker", // desc
                        required: true
                    },
                    workingDate: {
                        type: "date",
                        description: "working date", // desc
                        example: "2022-09-15 13:00:00",
                        required: true
                    }
                },
            },

            Message: {
                type: "string",
                description: "message", 
                example: "fetch success", 
            },
            // error model
            Error: {
                type: "object", //data type
                properties: {
                    message: {
                        type: "string", // data type
                        description: "Error message", // desc
                        example: "Not found", // example of an error message
                    },
                    internal_code: {
                        type: "string", // data type
                        description: "Error internal code", // desc
                        example: "Invalid parameters", // example of an error internal code
                    },
                },
            }
        },
    },
};



