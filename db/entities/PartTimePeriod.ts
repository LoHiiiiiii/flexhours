import {
  Check,
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { v4 } from 'uuid'
import { User } from './User'

@Entity({ tableName: 'part_time_period' })
export class PartTimePeriod {
  @PrimaryKey({ type: 'string', columnType: 'uuid' })
  id = v4()

  @ManyToOne(() => User, {
    fieldName: 'harvest_id',
    wrappedReference: true,
  })
  harvestId: IdentifiedReference<User>

  @Property({ columnType: 'date' })
  startsOn!: string

  @Property({ columnType: 'date' })
  @Check({ expression: 'starts_on < ends_on' })
  endsOn!: string

  @Property({ columnType: 'float4' })
  dailyHours!: number
}
