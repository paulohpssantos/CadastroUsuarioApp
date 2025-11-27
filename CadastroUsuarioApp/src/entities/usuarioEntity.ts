import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EnderecoEntity } from './enderecoEntity';

@Entity('usuario')
export class UsuarioEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column()
    telefone!: string;

    @Column()
    senha!: string;

    @Column()
    email!: string;

    @OneToMany(() => EnderecoEntity, endereco => endereco.usuario, { cascade: true })
    enderecos!: EnderecoEntity[];

}