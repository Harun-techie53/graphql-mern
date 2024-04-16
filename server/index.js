const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphqlSchema");
const colors = require("colors");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, () => console.log(`Server listening on port ${port}`));
