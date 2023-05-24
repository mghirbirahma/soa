const express = require('express');
const { ApolloServer } = require('@apollo/server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const formateurProtoPath = 'formateur.proto';
const formationProtoPath = 'formation.proto';
const participantProtoPath = 'participant.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

const formateurProtoDefinition = protoLoader.loadSync(formateurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const formationProtoDefinition = protoLoader.loadSync(formationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const participantProtoDefinition = protoLoader.loadSync(participantProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const formateurProto = grpc.loadPackageDefinition(formateurProtoDefinition).formateur;
const formationProto = grpc.loadPackageDefinition(formationProtoDefinition).formation;
const participantProto = grpc.loadPackageDefinition(participantProtoDefinition).participant;
const clientFormateurs = new formateurProto.FormateurService('localhost:50051', grpc.credentials.createInsecure());
const clientFormations = new formationProto.FormationService('localhost:50052', grpc.credentials.createInsecure());
const clientParticipants = new participantProto.ParticipantService('localhost:50053', grpc.credentials.createInsecure());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.start().then(() => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(server.getMiddleware());
});

app.get('/formateurs', (req, res) => {
  clientFormateurs.searchFormateurs({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.formateurs);
    }
  });
});

app.post('/formateur', (req, res) => {
  const { id, nom, description } = req.body;
  clientFormateurs.createFormateur(
    { formateur_id: id, nom: nom, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.formateur);
      }
    }
  );
});

app.get('/formateurs/:id', (req, res) => {
  const id = req.params.id;
  clientFormateurs.getFormateur({ formateurId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.formateur);
    }
  });
});

app.get('/formations', (req, res) => {
  clientFormations.searchFormations({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.formations);
    }
  });
});

app.post('/formation', (req, res) => {
  const { id, title, description } = req.body;
  clientFormations.createFormation(
    { formation_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.formation);
      }
    }
  );
});

app.get('/formations/:id', (req, res) => {
  const id = req.params.id;
  clientFormations.getFormation({ formationId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.formation);
    }
  });
});

app.get('/participants', (req, res) => {
  clientParticipants.searchParticipants({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.participants);
    }
  });
});

app.post('/participant', (req, res) => {
  const { id, nom, description } = req.body;
  clientParticipants.createParticipant(
    { participant_id: id, nom: nom, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.participant);
      }
    }
  );
});

app.get('/participants/:id', (req, res) => {
  const id = req.params.id;
  clientParticipants.getParticipant({ participantId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.participant);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
