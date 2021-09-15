import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { length } from 'class-validator';
import { THE_PITE_EXCHANGE_TABLE } from '../dynamoConfig';
import { User } from './user.model';

class UserService {
  constructor(private readonly client: DynamoDBDocumentClient) {}

  async getUser(uuid: string): Promise<User | null> {
    const getUserCmd = new QueryCommand({
      TableName: THE_PITE_EXCHANGE_TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': uuid
      }
    });

    try {
      const { Items } = await this.client.send(getUserCmd);

      if (Items?.length == 0) {
        return null;
      }

      const { uuid } = Items![0];

      return { uuid };
    } catch (e) {
      console.log(e);

      return null;
    }
  }
}
