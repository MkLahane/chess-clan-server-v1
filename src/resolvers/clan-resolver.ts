import { Clan } from "../entity/Clan";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../utils/auth";
import { User } from "src/entity/User";
import { UserContext } from "../contexts/user-context";

@Resolver()
export class ClanResolver {
  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async createClan(
    @Arg("clan_name") clan_name: string,
    @Ctx() { payload }: UserContext
  ) {
    try {
      await Clan.insert({
        name: clan_name,
        admin: await User.findOne(payload!.userId),
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return `Successfully created ${clan_name} clan`;
  }
}
