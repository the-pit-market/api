import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { Express } from 'express-serve-static-core';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { GraphqlContext } from './context';
import { Container } from 'typedi';

const PORT = 4000;

/**
 * Initialize the Apollo Server and GraphQL schema.
 * @param app The express application to apply the middleware to.
 */
async function bootstrapApolloServer(app: Express, db: DynamoDBClient) {
  Container.set('DB_CLIENT', db);

  const schema = await buildSchema({
    resolvers: [__dirname + '/graphql/**/*.resolver.{ts,js}'],
    container: Container
  });

  const server = new ApolloServer({
    schema,
    context: (_expressContext): GraphqlContext => ({ db })
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  return app;
}

/**
 * Creates a DynamoDB client in the specified region.
 */
async function createDynamoDBClient(region = 'us-west-2') {
  const client = new DynamoDBClient({ region });

  return DynamoDBDocumentClient.from(client);
}

async function main() {
  let app = express();
  app.use(cors());

  app = await bootstrapApolloServer(app, await createDynamoDBClient());

  app.listen(PORT, () => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${PORT}/graphql`
    );
  });
}

main().catch(err => console.log(err));
