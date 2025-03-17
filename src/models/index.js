const Sequelize = require("sequelize");
const config = require("../db-config/config.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);
let dbPath = config.databases["Database1"];
const db = {};

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false, // Use this for testing only
      },
    },
  }
);

fs.readdirSync(path.join(__dirname, ""))
  .filter(
    (file) =>
      // Exclude the files that start with ., main file itself and include only files with .js extention.
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) == ".js"
  )
  // This will iterate on each filtered files.
  // require each model in and return in map
  .forEach((file) => {
    try {
      // Require the path of the files dynamically and create the model.
      const model = require(path.join(__dirname, `/${file}`))(
        sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    } catch (err) {
      console.log(
        `------->>>>>>>>   Cant Create Model ${file} Due to -->>>`,
        err
      );
    }
  });

const { users, providers, categories } = db;
providers.belongsTo(providers, { foreignKey: "parent_id" });
categories.belongsTo(categories, { foreignKey: "parent_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
