require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("Mongo db connect successful");
  })
  .catch((err) => {
    console.log("Mongo db connection failed", err);
  });

const db = mongoose.connection;

db.on("error", () => {
  console.log("Mongo db connection failed");
});

module.exports = mongoose;
