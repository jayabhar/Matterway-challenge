import express from "express";
import path from "path";
import { Server } from 'socket.io';
import http from 'http';

const buildDir = path.join(process.cwd() + "/build");

const app = express();
const server = http.createServer(app);
const io =  new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});

const localVariable = 123;
const remoteObject = {
  fieldA: 'a',
  fieldB: 1,
  fieldC: /\d+/,
  someMethod: (value: number) => {
    return localVariable + value;
  },
  someMethodReturningAFunction: () => {
    return function (value: number) {
      return localVariable + value;
    };
  }
};

io.on('connection', (socket: any) => {
  console.log('we have a new connection');
  console.log('Available connections: ', io.of("/").sockets.size);
    

  socket.on('getFieldA', (callback: Function) => {
    try {
      socket.emit('getFieldA', remoteObject.fieldA);
      socket.broadcast.emit("getFieldA", remoteObject.fieldA);
    }
    catch(error) {
      console.error(error);
      callback(error.message);
    }
  })

  socket.on('getFieldB', (callback: Function)  => {
    try {
      socket.emit('getFieldB', remoteObject.fieldB);
      socket.broadcast.emit("getFieldB", remoteObject.fieldB);
    }
    catch(error) {
      console.error(error);
      callback(error.message);
    }
  })

  socket.on('getFieldC', (callback: Function)  => {
    try {
      const data = '123'.match(remoteObject.fieldC);
      socket.emit('getFieldC', data);
      socket.broadcast.emit("getFieldC", data);
    }
    catch(error) {
      console.error(error);
      callback(error.message);
    }
  });

  socket.on('getsomeMethodData', async (inputValue: number, callback: Function) => {
    try {
      const data = await remoteObject.someMethod(inputValue);
      socket.emit('getsomeMethodData', data);
      socket.broadcast.emit("getsomeMethodData", data);
    }
    catch(error) {
      console.error(error);
      callback(error.message);
    }
  })

  socket.on('getSomeMethodReturningAFunction', async (inputValue: number,  callback: Function) => {
    try {
      const method = await remoteObject.someMethodReturningAFunction();
      const data = method(inputValue);
      socket.emit('getSomeMethodReturningAFunction', data);
      socket.broadcast.emit("getSomeMethodReturningAFunction", data);
    }
    catch(error) {
      console.error(error);
      callback(error.message);
    }
  })

  socket.on('disconnect', () => {
    console.log('User has left!!!');
    console.log('Available connections: ', io.of("/").sockets.size);
    socket.removeAllListeners();
  })
});

app.use(express.static(buildDir));

app.get("/*", function (req, res) {
  res.sendFile(path.join(buildDir, "index.html"));
});

const PORT = process.env.PORT || 3001;
console.log("checking port", PORT);
server.listen(PORT, () => {
  console.log(`Server now listening on port: ${PORT}`);
});
