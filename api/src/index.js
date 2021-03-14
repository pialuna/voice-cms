require('dotenv').config();
const http = require('http');
const app = require('./app');


const port = process.env.API_PORT || 1234;

const server = http.createServer(app);

server.listen(port);