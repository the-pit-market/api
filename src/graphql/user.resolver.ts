import { Arg, Mutation, Query } from 'type-graphql';
import { Service } from 'typedi';
import { User } from './user.model';
import { UserService } from './user.service';

@Service()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(_ => User, { nullable: true })
  async user(@Arg('uuid') uuid: string): Promise<User | null> {
    return await this.userService.getOne(uuid);
  }

  @Mutation(_ => User, { nullable: true })
  async signup(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    return { uuid: 'TEMP' };
  }
}
