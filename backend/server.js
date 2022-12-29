require("dotenv").config()
process.env.TZ = 'UTC'
const app = require("./app");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + addr : "port " + port;
  console.log('server started', `http://localhost:${port}/api/`)
};

const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);


const Appointment = require('./models/appointment')
const { Server } = require("socket.io");
const io = new Server(server);

const appointmentsIo = io.of('/socket/appointments')
const appointmentStream = Appointment.watch()
// const activeUsers = []

appointmentsIo.on('connection', (socket) => {
  console.log('user connected');
  // activeUsers.add(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


const User = require('./models/user')
appointmentStream.on('change', async (change) => {
  console.log('change in appointments', appointmentsIo.sockets.size);
  if (change.operationType !== 'update') {
    return
  }

  let obj = change
  if (change.operationType === 'update' && change.updateDescription.updatedFields.customer) {
    const user = await User.findOne({ _id: change.updateDescription.updatedFields.customer })
    obj = {
      ...change
    }
    change.updateDescription.updatedFields.customer = user
  }

  appointmentsIo.emit('change', obj)
})

