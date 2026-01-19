const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://localhost:27017/mydatabase";
const { connect } = require("mongoose");
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(MONGODB_URI)
      .then((_) => {
        console.log("Database connected successfully");
      })
      .catch((err) => {
        console.error("Database connection error:", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
