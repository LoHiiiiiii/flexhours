import { Options } from '@mikro-orm/core'
import 'dotenv/config'
import { Account, User } from '../db/entities/User'
import { PartTimePeriod } from '../db/entities/PartTimePeriod'
import { defaultEntities } from '@next-auth/mikro-orm-adapter'

const config: Options = {
  type: 'postgresql',
  dbName: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_URL,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [User, PartTimePeriod, Account, defaultEntities.Session],
  debug: process.env.DEBUG === 'true' || process.env.DEBUG?.includes('db'),
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'db/migrations',
    glob: '!(*.d).{js,ts}',
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
  },
  seeder: {
    path: 'db/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
}

export default config
