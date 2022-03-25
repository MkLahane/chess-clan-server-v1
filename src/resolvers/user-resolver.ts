import {
  Resolver,
  Query,
  UseMiddleware,
  Ctx,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import { isAuth } from "../utils/auth";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/token";
import { UserContext } from "../contexts/user-context";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hey there!!!!!";
  }
  @Query(() => User)
  @UseMiddleware(isAuth)
  getUser(@Ctx() { payload }: UserContext) {
    return User.findOne(payload!.userId);
  }
  @Query(() => [User])
  async getUsers() {
    return await User.find();
  }
  @Mutation(() => Boolean)
  async register(
    @Arg("name") name: string,
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        name,
        username,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: UserContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid email or password");
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: UserContext) {
    sendRefreshToken(res, "");
    return true;
  }
}
