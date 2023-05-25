const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Food {
    id: String!
    title: String!
    description: String!
  }

  type Order {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    food(id: String!): Food
    foods: [Food]
    order(id: String!): Order
    orders: [Order]
  }
  type Mutation {
    addFood(id: String!, title: String!, description:String!): Food
    addOrder(id: String!, title: String!, description:String!): Order
    deleteFood(id: String!): Boolean
    updateFood(id: String!, title: String!, description: String!): Food
    updateOrder(id: String!, title: String!, description: String!): Order
    deleteOrder(id: String!): Boolean
  }
`;

module.exports = typeDefs