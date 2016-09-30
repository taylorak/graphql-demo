const express = require('express');
const graphql = require('graphql').graphql;
const graphqlHTTP = require('express-graphql');
const app = express();
const PORT = process.env.NODE_ENV || 3000;

app.listen(PORT, (err) => {
  console.log(`server is listening on localhost:${PORT}`);
})
