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
                        type: "User", // data-type
                        description: "Todo's title", // desc
                    },
                    worker: {
                        type: "User", // data type
                        description: "The status of the todo", // desc
                        required: true
                    },
                    workingDate: {
                        type: "string",
                        description: "Working Date identification number", // desc
                        example: "ASDFERGXCVSADF234ASCADSXC34TRFRGV",
                        required: true
                    },
                    start_time: {
                        type: "date",
                        description: "start time for the appointment", // desc
                        example: "2022-09-15 13:00:00",
                        required: true
                    },
                    end_time: {
                        type: "date",
                        description: "end time for the appointment", // desc
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
            // Todo input model
            WorkingDate: {
                type: "object", // data type
                properties: {
                    _id: {
                        type: "string", // data-type
                        description: "User identification number", // desc
                        example: "ASDFERGXCVSADF234ASCADSXC34TRFRGV", // example of an id
                    },
                    worker: {
                        type: "User", // data type
                        description: "The status of the todo", // desc
                        required: true
                    },
                    date: {
                        type: "date",
                        description: "working date", // desc
                        example: "2022-09-15 13:00:00",
                        required: true
                    },
                    isActive: {
                        type: "boolean",
                        description: "indicates if the wprking date is active", // desc
                        example: "true",
                        default: 'true'
                    }
                },
            },

            Message: {
                type: "object",
                properties: {
                    message: {
                        type: "string", 
                        description: "message", 
                        example: "fetch success", 
                    }
                },
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