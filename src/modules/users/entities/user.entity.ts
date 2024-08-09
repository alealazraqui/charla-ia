import { Rol } from '../../roles/entities/rol.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'typeorm-base-utils';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  active: boolean;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column({ name: 'rol_id', nullable: true })
  rolId: number;
}
