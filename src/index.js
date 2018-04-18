import http from 'http'
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import socketio from 'socket.io';

require('dotenv').load()

mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3092;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon';

const mongooseConnection = mongoose.connect(MONGO_URI, {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
});

const app = express();

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(cors('*'))
// body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/media', express.static('files'));

// test server
// app.get('*', (req, res) => {
//   res.send('Hello world')
// })

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', function (client) {
  console.log('client ', client.id)
});


mongooseConnection.then(
  () => {
    console.log('Mongoose connected to ');
    server.listen(parseInt(PORT), err => {
      if (err) {
        throw err
      }
      io.listen(parseInt(SOCKET_PORT))
      console.log('> Ready on http://localhost:' + PORT )
    })
  },
  (err) => {
    console.log(`Mongoose connection error: ${err}`);
  }
)
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
});
