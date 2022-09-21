import { Options } from '@mikro-orm/core'
import 'dotenv/config'
import { Account, User } from '../db/entities/User'
import { PartTimePeriod } from '../db/entities/PartTimePeriod'
import { defaultEntities } from '@next-auth/mikro-orm-adapter'
import { Task } from '../db/entities/Task'

const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  entities: [User, PartTimePeriod, Account, Task, defaultEntities.Session],
  debug: process.env.DEBUG === 'true' || process.env.DEBUG?.includes('db'),
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'db/migrations',
    glob: '!(*.d).{js,ts}',
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
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
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
  schemaGenerator: {
		disableForeignKeys: false,
		createForeignKeyConstraints: true,
	},
}

export default config
