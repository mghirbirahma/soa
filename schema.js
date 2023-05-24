const { gql } = require('@apollo/server');

const typeDefs = `#graphql
const typeDefs = gql
  type Formateur {
    id: String!
    nom: String!
    description: String!
  }

  type Formation {
    id: String!
    titre: String!
    description: String!
  }

  type Participant {
    id: String!
    nom: String!
    description: String!
  }

  type Query {
    formateur(id: String!): Formateur
    formateurs: [Formateur]
    formation(id: String!): Formation
    formations: [Formation]
    participant(id: String!): Participant
    participants: [Participant]
  }

  type Mutation {
    createFormateur(id: String!, nom: String!, description: String!): Formateur
    createFormation(id: String!, titre: String!, description: String!): Formation
    createParticipant(id: String!, nom: String!, description: String!): Participant
  }
`;

module.exports = typeDefs;
