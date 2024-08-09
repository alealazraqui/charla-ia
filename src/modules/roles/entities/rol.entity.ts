import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from 'typeorm-base-utils';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class Rol extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @Column()
  preloaded: boolean;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'rol_permission',
    joinColumn: {
      name: 'rolId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'namePermission',
      referencedColumnName: 'name',
    },
  })
  permissions: Permission[];
}
