import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users", { schema: "auth-server" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  Id: number;

  @Column("varchar", { name: "Email", length: 100 })
  Email: string;

  @Column("varchar", { name: "FirstName", length: 100 })
  FirstName: string;

  @Column("varchar", { name: "LastName", length: 100 })
  LastName: string;

  @Column("varchar", { name: "ProfilePicPath", nullable: true, length: 100 })
  ProfilePicPath: string | null;
}
