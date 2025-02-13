"use strict";
const app = require("./configs/app.config")
const PORT = process.env.port || process.env.PORT || 4003
const dalService = require("./src/dal.service");

dalService.init();
app.listen(PORT, () => console.log("Server started on port:", PORT))