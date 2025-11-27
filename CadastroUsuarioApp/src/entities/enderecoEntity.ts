import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UsuarioEntity } from './usuarioEntity';

@Entity('endereco')
export class EnderecoEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  logradouro!: string;

  @Column()
  numero!: string;

  @Column()
  bairro!: string;

  @Column()
  cep!: string;

  @Column()
  uf!: string;

  @Column()
  cidade!: string;

  /** relação ManyToOne para usuário; cria a coluna usuarioId como FK */
  @ManyToOne(() => UsuarioEntity, usuario => usuario.enderecos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: UsuarioEntity;
}