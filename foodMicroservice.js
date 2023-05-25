const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const foodProtoPath = 'food.proto';
const foodProtoDefinition = protoLoader.loadSync(foodProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const foodProto = grpc.loadPackageDefinition(foodProtoDefinition).food;
const db = new sqlite3.Database('./database.db'); 

db.run(`
  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);
const foodService = {
  getFood: (call, callback) => {
    const { food_id } = call.request;
    
    db.get('SELECT * FROM foods WHERE id = ?', [food_id], (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        const food = {
          id: row.id,
          title: row.title,
          description: row.description,
        };
        callback(null, { food });
      } else {
        callback(new Error('Food not found'));
      }
    });
  },
  searchFoods: (call, callback) => {
    db.all('SELECT * FROM foods', (err, rows) => {
      if (err) {
        callback(err);
      } else {
        const foods = rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
        }));
        callback(null, { foods });
      }
    });
  },
  CreateFood: (call, callback) => {
    const { food_id, title, description } = call.request;
    db.run(
      'INSERT INTO foods (id, title, description) VALUES (?, ?, ?)',
      [product_id, title, description],
      function (err) {
        if (err) {
          callback(err);
        } else {
          const food = {
            id: food_id,
            title,
            description,
          };
          callback(null, { food });
        }
      }
    );
  },
};



const server = new grpc.Server();
server.addService(foodProto.FoodService.service, foodService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Food microservice running on port ${port}`);
