import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export type GraphqlContext = {
  db: DynamoDBDocumentClient;
};
