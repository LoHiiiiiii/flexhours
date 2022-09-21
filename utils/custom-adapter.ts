import { MikroORM, Options, wrap } from "@mikro-orm/core";
import { defaultEntities, MikroOrmAdapter } from "@next-auth/mikro-orm-adapter";
import { User } from "db/entities/User";
import { Adapter } from "next-auth/adapters";

export function CustomAdapter(
    ormOptions: Options,
    options?: {
        entities?: Partial<typeof defaultEntities>
    }
): Adapter { 


    const ormAdapter = MikroOrmAdapter(ormOptions, options)

    return {
        ...ormAdapter,
        async createUser(data) { // It is unclear what method the adapter uses to get the account, so it is intercepted here.
            const em = (await MikroORM.init(ormOptions)).em;
            const user = await em.findOne(User, { harvestId: Number(data.harvestId) })
            if (!user) {
                return ormAdapter.createUser(data)
            }
            if (typeof data.name === "string") {
                user.name = data.name;
                await em.flush();
            }
            return wrap(user).toObject()
        },
        async getUser(id) {
            const em = (await MikroORM.init(ormOptions)).em;
            const user = await em.findOne(User, { id });
            if (!user || !user.name) return null; //return null with an empty name to update it
      
            return wrap(user).toObject();
          }
    }
}