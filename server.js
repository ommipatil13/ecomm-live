// const express = require("express");
import express from 'express';
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productRoutes.js';
import cors from 'cors';
import path from 'path';


//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
// app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);


//rest api
// app.get('/', (req, res) => {
//     res.send("<h1> Welcome to E-Comm MERN Stack Web App </h1>");
// });

//hosting on live server
// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, './client/build/index.html'))
// })
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


//PORT
const PORT = process.env.PORT;

//run listen
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});