import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clients", { schema: "auth-server" })
export class Clients {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  Id: number;

  @Column("varchar", { name: "ApiId", nullable: true, length: 100 })
  ApiId: string | null;

  @Column("varchar", { name: "ApiSecret", nullable: true, length: 100 })
  ApiSecret: string | null;

  @Column("varchar", { name: "ProviderClientId", length: 100 })
  ProviderClientId: string;

  @Column("varchar", { name: "ProviderClientSecret", length: 100 })
  ProviderClientSecret: string;

  @Column("varchar", { name: "IsActive", length: 100 })
  IsActive: string;
}
