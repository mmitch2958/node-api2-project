const express = require('express');
const router = require('./hubs/hubs-router');

//add router from hubs folder 
const hubsRouter = require('./hubs/hubs-router');
//5 import router 
const productsRouter = require('./products/products-router.js')

server.use('/api/posts', hubsRouter);


const server = express();

server.use(express.json());