import { v4 as randomUUID } from 'uuid'
import {
  Property,
  PrimaryKey,
  Entity,
  OneToMany,
  Collection,
  Cascade,
  Unique,
  ManyToOne,
  Enum,
} from '@mikro-orm/core'

import { defaultEntities } from '@next-auth/mikro-orm-adapter'
import { PartTimePeriod } from './PartTimePeriod'

export enum ProviderType {
  OAUTH = 'oauth',
  EMAIL = 'email',
  CREDENTIALS = 'credentials',
}

@Entity()
export class User implements defaultEntities.User {
  @PrimaryKey()
  id: string = randomUUID()

  @Property({ nullable: false, unique: true, name: 'harvest_id' })
  harvestId: number

  @Property({ nullable: true })
  name?: string

  @Property({ type: 'float', nullable: false, default: 0.0 })
  preHarvestBalance: number

  @Property({ type: 'Date', nullable: true })
  emailVerified: Date | null = null

  @OneToMany({
    entity: () => PartTimePeriod,
    mappedBy: (period) => period.harvestId,
  })
  @OneToMany({
    entity: () => defaultEntities.Session,
    mappedBy: (session) => session.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  sessions = new Collection<defaultEntities.Session>(this)

  @OneToMany({
    entity: () => defaultEntities.Account,
    mappedBy: (account) => account.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  accounts = new Collection<defaultEntities.Account>(this)
}

@Entity()
@Unique({ properties: ['provider', 'providerAccountId'] })
export class Account implements defaultEntities.Account {
  @PrimaryKey()
  id: string = randomUUID()

  @ManyToOne({
    entity: () => User,
    hidden: true,
    onDelete: 'cascade',
  })
  user!: User

  @Property({ persist: false })
  userId!: string

  @Enum({ items: () => ProviderType })
  type!: ProviderType

  @Property()
  provider!: string

  @Property()
  providerAccountId!: string

  @Property({ nullable: true })
  refresh_token?: string

  @Property({ nullable: true })
  access_token?: string

  @Property({ nullable: true })
  expires_at?: number

  @Property({ nullable: true })
  token_type?: string

  @Property({ nullable: true })
  scope?: string

  @Property({ nullable: true })
  id_token?: string

  @Property({ nullable: true })
  session_state?: string
}
