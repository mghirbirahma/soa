const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const formationProtoPath = 'formation.proto';
const formationProtoDefinition = protoLoader.loadSync(formationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const formationProto = grpc.loadPackageDefinition(formationProtoDefinition).formation;

const formationService = {
  getFormation: (call, callback) => {
    const formation = {
      id: call.request.formation_id,
      title: 'Example formation',
      description: 'This is an example formation.',
    };
    callback(null, { formation });
  },
  searchFormations: (call, callback) => {
    const { query } = call.request;

    const formations = [
      {
        id: '1',
        title: 'Example formation 1',
        description: 'This is the first example formation.',
      },
      {
        id: '2',
        title: 'Example formation 2',
        description: 'This is the second example formation.',
      },
    ];
    callback(null, { formations });
  },
  createFormation: (call, callback) => {
    const { formation_id, nom, description } = call.request;
    const formation = {
      id: formation_id,
      title: nom,
      description: description,
    };
    callback(null, { formation });
  },
};

const server = new grpc.Server();
server.addService(formationProto.FormationService.service, formationService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${boundPort}`);
  server.start();
});

console.log(`Formation microservice running on port ${port}`);
