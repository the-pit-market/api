import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { Inject, Service } from 'typedi';
import { THE_PIT_EXCHANGE_TABLE } from '../dynamoConfig';
import { User } from './user.model';

@Service()
export class UserService {
  @Inject('DB_CLIENT')
  private readonly client!: DynamoDBDocumentClient;

  async getUser(uuid: string): Promise<User | null> {
    const getUserCmd = new QueryCommand({
      TableName: THE_PIT_EXCHANGE_TABLE,
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': uuid,
        ':sk': 'METADATA'
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

  async insertUser(user: User) {
    const insertUserCmd = new PutCommand({
      TableName: THE_PIT_EXCHANGE_TABLE,
      Item: {
        PK: user.uuid,
        SK: 'METADATA',
        user
      }
    });

    await this.client.send(insertUserCmd);
  }
}
