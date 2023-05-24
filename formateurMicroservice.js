const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const formateurProtoPath = 'formateur.proto';
const formateurProtoDefinition = protoLoader.loadSync(formateurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const formateurProto = grpc.loadPackageDefinition(formateurProtoDefinition).formateur;

const formateurService = {
  getFormateur: (call, callback) => {
    const formateur = {
      id: call.request.formateur_id,
      nom: 'Example formateur',
      description: 'This is an noun of formateur.',
    };
    callback(null, { formateur });
  },
  searchFormateurs: (call, callback) => {
    const { query } = call.request;

    const formateurs = [
      {
        id: '1',
        nom: 'Example formateur 1',
        description: 'This is the first example formateur.',
      },
      {
        id: '2',
        nom: 'Example formateur 2',
        description: 'This is the second example formateur.',
      },
    ];
    callback(null, { formateurs });
  },
  createFormateur: (call, callback) => {
    const { query } = call.request;
    const formateur = {
      id: call.request.formateur_id,
      nom: call.request.nom,
      description: call.request.description,
    };
    callback(null, { formateur });
  },
};

const server = new grpc.Server();
server.addService(formateurProto.FormateurService.service, formateurService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${boundPort}`);
  server.start();
});
console.log(`Formateur microservice running on port ${port}`);
