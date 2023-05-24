const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const formateurProtoPath = 'formateur.proto';
const formationProtoPath = 'formation.proto';
const participantProtoPath = 'participant.proto';

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

const resolvers = {
  Query: {
    formation: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientFormations.getFormation({ formationId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formation);
          }
        });
      });
    },
    formations: () => {
      return new Promise((resolve, reject) => {
        clientFormations.searchFormations({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formations);
          }
        });
      });
    },
    formateur: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientFormateurs.getFormateur({ formateurId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formateur);
          }
        });
      });
    },
    formateurs: () => {
      return new Promise((resolve, reject) => {
        clientFormateurs.searchFormateurs({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formateurs);
          }
        });
      });
    },
    participant: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientParticipants.getParticipant({ participantId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.participant);
          }
        });
      });
    },
    participants: () => {
      return new Promise((resolve, reject) => {
        clientParticipants.searchParticipants({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.participants);
          }
        });
      });
    },
  },
  Mutation: {
    createFormateur: (_, { id, nom, description }) => {
      return new Promise((resolve, reject) => {
        clientFormateurs.createFormateur({ formateur_id: id, nom: nom, description: description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formateur);
          }
        });
      });
    },
    createFormation: (_, { id, title, description }) => {
      return new Promise((resolve, reject) => {
        clientFormations.createFormation({ formation_id: id, title: title, description: description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.formation);
          }
        });
      });
    },
    createParticipant: (_, { id, nom, description }) => {
      return new Promise((resolve, reject) => {
        clientParticipants.createParticipant({ participant_id: id, nom: nom, description: description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.participant);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
