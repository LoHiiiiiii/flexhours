import {
  Entity,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

@Entity({ tableName: "task" })
export class Task {
  @PrimaryKey()
  id: number;

  @Property()
  type: string;

  @Property({ nullable: true })
  description!: string;
}
