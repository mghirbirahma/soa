const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const participantProtoPath = 'participant.proto';
const participantProtoDefinition = protoLoader.loadSync(participantProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const participantProto = grpc.loadPackageDefinition(participantProtoDefinition).participant;

const participantService = {
  getFormation: (call, callback) => {
    const participant = {
      id: call.request.formation_id,
      nom: 'Example participant',
      description: 'This is an noun of participant.',
    };
    callback(null, { participant });
  },
  searchParticipants: (call, callback) => {
    const { query } = call.request;

    const participants = [
      {
        id: '1',
        nom: 'Example participant 1',
        description: 'This is the first example participant.',
      },
      {
        id: '2',
        nom: 'Example participant 2',
        description: 'This is the second example participant.',
      },
    ];
    callback(null, { participants });
  },
  createParticipant: (call, callback) => {
    const { query } = call.request;
    const participant = {
      id: call.request.participant_id,
      nom: call.request.nom,
      description: call.request.description,
    };
    callback(null, { participant });
  },
};

const server = new grpc.Server();
server.addService(participantProto.ParticipantService.service, participantService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${boundPort}`);
  server.start();
});

console.log(`Participant microservice running on port ${port}`);
