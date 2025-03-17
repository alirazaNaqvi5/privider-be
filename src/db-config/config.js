module.exports = {
  databases: {
    Database1: {
      database: process.env.DB, //you should always save these values in environment variables
      username: process.env.DB_USER, //only for testing purposes you can also define the values here
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres", //here you need to define the dialect of your database, in my case it is Postgres
    },
  },
};
