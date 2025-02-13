"use strict";
const env = require("dotenv")
env.config()
const express = require("express")
const app = express()
const path = require("path")
const taskController = require("../src/task.controller")
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use("/task", taskController)

module.exports = app