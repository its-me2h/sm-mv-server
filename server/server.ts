import express from "express";
import { createServer } from "http";
import cors from "cors";

import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
// import schema from "./api/schema";
import authorization from "./middlewares/authorization";
import { Server } from "socket.io";
import { socketManager } from "./api/socket";
import schema from "./api/schema";
import { authenticateDatabase } from "./src/configs/database";

const app = express();

// Enable cors with specific origins and credentials support
app.use(
    cors({
        origin: ["http://localhost:8081", "http://localhost:9009"],
        credentials: true,
    })
);

// Parse json request bodies
app.use(bodyParser.json())

// Private GraphQL Endpoint: Requires accessToken for authorization
// app.use("/graphql-private", authorization, graphqlHTTP({
//     schema,
// }))

// Public GraphQL Endpoint: No authorization required
// app.use("/graphql-public", graphqlHTTP({ 
//     schema 
// }));

// Endpoint with graphiql interface
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

// Create an HTTP server instance using Express app
const httpServer = createServer(app);

const PORT = 9009;

// Initialize Socket.IO and set CORS options
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:9009"],
        methods: ["GET", "POST"],
    }
});


// Handle socketIo connections
socketManager(io);

// Start the server
httpServer.listen(PORT, async () => {
    console.log("Server listening on port " + PORT);
    // Connect to the database when the server starts
    await authenticateDatabase();
});
