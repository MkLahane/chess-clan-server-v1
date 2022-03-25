//import { Clan } from "../entity/Clan";
import {
  Arg,
  Ctx,
  Mutation,
  //Query,
  Resolver,
  InputType,
  Field,
  //UseMiddleware,
} from "type-graphql";
//import { isAuth } from "../utils/auth";
import { UserContext } from "../contexts/user-context";
import { UserRoles } from "../entity/ClanUser";

// type CreateClanUserInputType = {
//   userId: number;
//   userRole: UserRoles;
// };

@InputType()
class CreateClanType {
  @Field()
  userId: number;

  @Field()
  userRole: UserRoles;
}

@Resolver()
export class ClanResolver {
  @Mutation(() => String)
  //@UseMiddleware(isAuth)
  async createClan(
    @Arg("clanName") clanName: string,
    @Arg("clanUsers", () => [CreateClanType]) clanUsers: CreateClanType[],
    @Ctx() { payload }: UserContext
  ) {
    console.log(clanName);
    console.log(clanUsers);
    console.log(payload!.userId);
  }

  // @Query(() => [Clan])
  // @UseMiddleware(isAuth)
  // async getClans() {
  //   return await Clan.find({ relations: ["users"] });
  // }

  // @Query(() => Clan)
  // @UseMiddleware(isAuth)
  // async getClan(@Arg("clanId") clanId: number) {
  //   try {
  //     const clan = await Clan.findOne(clanId, { relations: ["users"] });
  //     return clan;
  //   } catch (err) {
  //     console.log(err);
  //     return null;
  //   }
  // }
}
