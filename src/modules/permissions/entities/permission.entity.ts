import { Rol } from '../../roles/entities/rol.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  name: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column()
  description: string;

  @Column()
  module: string;

  @ManyToMany(() => Rol, (r) => r.permissions)
  roles: Rol[];
}
