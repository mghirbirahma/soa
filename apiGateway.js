const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const foodProtoPath = 'food.proto';
const orderProtoPath = 'order.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

const foodProtoDefinition = protoLoader.loadSync(foodProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const foodProto = grpc.loadPackageDefinition(foodProtoDefinition).food;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;
const clientFoods = new foodProto.FoodService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
const clientOrders = new orderProto.OrderService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/foods', (req, res) => {
  clientFoods.searchFoods({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.foods);
    }
  });
});

app.post('/foods', (req, res) => {
  const { id, title, description } = req.body;
  clientFoods.createFood(
    { food_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.food);
      }
    }
  );
});

app.get('/foods/:id', (req, res) => {
  const id = req.params.id;
  clientFoods.getFood({ foodId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.food);
    }
  });
});

app.put('/foods/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  clientFoods.updateFood(
    { food_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.food);
      }
    }
  );
});

app.delete('/foods/:id', (req, res) => {
  const id = req.params.id;
  clientFoods.deleteFood({ food_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

app.get('/orders', (req, res) => {
  clientOrders.searchOrders({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.orders);
    }
  });
});

app.post('/orders', (req, res) => {
  const { id, title, description } = req.body;
  clientOrders.createOrder(
    { order_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.order);
      }
    }
  );
});

app.get('/orders/:id', (req, res) => {
  const id = req.params.id;
  clientOrders.getOrder({ order_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.order);
    }
  });
});

app.put('/orders/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  clientOrders.updateOrder(
    { order_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.order);
      }
    }
  );
});

app.delete('/orders/:id', (req, res) => {
  const id = req.params.id;
  clientOrders.deleteOrder({ order_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
