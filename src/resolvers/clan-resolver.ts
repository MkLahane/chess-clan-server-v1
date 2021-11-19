import { Clan } from "../entity/Clan";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../utils/auth";
import { User } from "../entity/User";
import { UserContext } from "../contexts/user-context";
import { ClanUser } from "../entity/ClanUser";
import { UserRoles } from "../entity/ClanUser";

@Resolver()
export class ClanResolver {
  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async createClan(
    @Arg("clanName") clanName: string,
    @Ctx() { payload }: UserContext
  ) {
    try {
      const result = await Clan.insert({ name: clanName });
      const clanId = result.raw[0].id;
      const user = await User.findOne(payload!.userId);
      user!.clan = clanId;
      const clanUserResult = await ClanUser.insert({
        userRole: UserRoles.ADMIN,
        user,
      });
      user!.clanUser = clanUserResult.raw[0].id;
      user!.save();
      return `${clanName} Clan created successfully!`;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async addUser(@Arg("clanId") clanId: number, @Arg("userId") userId: number) {
    const clan = await Clan.findOne(clanId);
    if (clan === undefined) {
      return "Can't find the specified clan!";
    }
    const user = await User.findOne(userId);
    if (user === undefined) {
      return "Can't find the specified user!";
    }
    user!.clan = clan;
    const clanUserResult = await ClanUser.insert({
      userRole: UserRoles.PLAYER,
      user,
    });
    user!.clanUser = clanUserResult.raw[0].id;
    user!.save();
    return `User added successfully!`;
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async updateClan(
    @Arg("clanId") clanId: number,
    @Ctx() { payload }: UserContext
  ) {
    const newClan = await Clan.findOne(clanId);
    if (newClan === null) {
      return "Can't find the specfied clan";
    }
    const user = await User.findOne(payload!.userId);
    const oldClan = await Clan.findOne(user!.clan);
    oldClan!.users = oldClan!.users.filter(({ id }) => id === user!.id);
    user!.clan = newClan!;
    return `Update your clan to: ${newClan!.name}`;
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async removeUser(
    @Arg("clanId") clanId: number,
    @Arg("userId") userId: number
  ) {
    const clan = await Clan.findOne(clanId);
    if (clan == null) {
      return "Can't find the specified clan!";
    }
    clan.users = clan.users.filter(({ id }) => id === userId);
    clan.save();

    return "User deleted successfully!";
  }
  @Query(() => [Clan])
  @UseMiddleware(isAuth)
  async getClans() {
    return await Clan.find({ relations: ["users"] });
  }

  @Query(() => Clan)
  @UseMiddleware(isAuth)
  async getClan(@Arg("clanId") clanId: number) {
    try {
      const clan = await Clan.findOne(clanId, { relations: ["users"] });
      return clan;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
