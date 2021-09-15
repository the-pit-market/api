import { Query } from 'type-graphql';
import { User } from './user.model';

export class UserResolver {
    @Query(_ => [User])
    async users(): Promise<User[]> {
        return Promise.resolve([]);
    }
}
