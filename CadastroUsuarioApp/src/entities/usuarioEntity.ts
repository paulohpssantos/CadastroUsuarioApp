import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


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

    @Column()
    complemento!: string;

}