API Gateway
This README provides instructions for setting up and using the API Gateway (apiGateway.js) in your application. The API Gateway acts as a central hub for routing client requests to the appropriate services and facilitating communication with the underlying gRPC services.

Prerequisites
Before running the API Gateway, ensure that the following dependencies are installed:

Node.js (v10 or higher)
Express.js
Apollo Server
Body Parser
CORS
gRPC
Proto Loader
Installation
To get started with the API Gateway, follow these steps:

Clone the repository or download the source code that includes the apiGateway.js file.
Open your terminal and navigate to the project directory.
Run the following command to install the required dependencies:
bash
Copy code
npm install
Configuration
Before running the API Gateway, you need to configure the gRPC services and the port number.

Open the apiGateway.js file in a text editor.
Modify the following lines to specify the paths to your gRPC proto files:
javascript
Copy code
const productProtoPath = 'product.proto';
const orderProtoPath = 'order.proto';
Update the gRPC service URLs to match your service configurations:
javascript
Copy code
const clientProducts = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());
const clientOrders = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());
Optionally, you can change the port number for the API Gateway by modifying the following line:
javascript
Copy code
const port = 3000;
Starting the API Gateway
To start the API Gateway, follow these steps:

Open a terminal and navigate to the project directory.
Run the following command:
bash
Copy code
node apiGateway.js
Once the API Gateway is running, you should see a message in the console indicating the port number:

arduino
Copy code
API Gateway running on port 3000
API Endpoints
The API Gateway exposes the following endpoints for interacting with the gRPC services:

GET /products

Description: Retrieves a list of products.
Response: Returns a JSON array of products.
POST /product

Description: Creates a new product.
Request Body: Requires the following properties:
id: The ID of the product.
title: The title of the product.
description: The description of the product.
Response: Returns the created product as a JSON object.
GET /products/:id

Description: Retrieves a specific product by ID.
Request Parameter: Requires the id parameter to specify the ID of the product.
Response: Returns the product as a JSON object.
GET /orders

Description: Retrieves a list of orders.
Response: Returns a JSON array of orders.
POST /order

Description: Creates a new order.
Request Body: Requires the following properties:
id: The ID of the order.
title: The title of the order.
description: The description of the order.
Response: Returns the created order as a JSON object.
GET /orders/:id

Description: Retrieves a specific order by ID.
Request Parameter: Requires the id parameter to specify the ID of the order.
Response: Returns the order as a JSON object.
Conclusion
The API Gateway serves as a unified interface for accessing the gRPC services related to products and orders. By starting the API Gateway and making requests to the provided endpoints, you can interact with the the services, retrieve data, and create new entries as required.
