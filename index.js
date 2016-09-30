const express = require('express');
const graphql = require('graphql');
const graphQLHTTP = require('express-graphql');
const app = express();
const PORT = process.env.NODE_ENV || 3000;

const TODOS = [
  {
    id: 1,
    title: "Item 1",
    cost: 5,
    completed: true
  },
  {
    id: 2,
    title: "Item 2",
    cost: 3,
    completed: true
  }
]

const TodoType = new graphql.GraphQLObjectType({
  name: 'todo',
  fields: function () {
    return {
      id: {
        type: graphql.GraphQLID
      },
      title: {
        type: graphql.GraphQLString
      },
      cost: {
        type: graphql.GraphQLInt
      },
      completed: {
        type: graphql.GraphQLBoolean
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      cheaperThan: {
        type: new graphql.GraphQLList(TodoType),
        args: {
          price: { type: graphql.GraphQLInt }
        },
        resolve: function(_,{price}) {
          return new Promise(function(resolve, reject) {
            let cheaperItems = TODOS.filter(function(cur) {
              return cur.cost < price;
            })
            resolve(cheaperItems);
          })
        }
      },
      aveCost: {
        type: graphql.GraphQLInt,
        resolve: function() {
          return new Promise(function(resolve, reject) {
            let total = TODOS.reduce(function(prev, cur) {
              return prev.cost + cur.cost;
            });
            resolve(total/TODOS.length);
          })
        }
      },
      todos: {
        type: new graphql.GraphQLList(TodoType),
          resolve: function () {
          return new Promise(function(resolve, reject){
            resolve(TODOS);
          })
        }
      }
    }
  }
});

const Schema = new graphql.GraphQLSchema({
  query: queryType,
})

// This is just an internal test
var query = 'query { todos { id, title, completed }, aveCost, cheaperThan(price:4) { id, title, cost, completed } }';
graphql.graphql(Schema, query).then( function(result) {
  console.log(JSON.stringify(result,null," "));
});

app.use('/', graphQLHTTP({ schema: Schema, pretty: true }))

app.listen(PORT, (err) => {
  console.log(`server is listening on localhost:${PORT}`);
})
