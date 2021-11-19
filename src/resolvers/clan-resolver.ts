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
      user!.save();
      await ClanUser.insert({
        userRole: UserRoles.ADMIN,
        user,
      });
      return `${clanName} Clan created successfully!`;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => Clan)
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
