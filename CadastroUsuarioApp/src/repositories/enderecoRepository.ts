import { AppDataSource } from '../database/connection';
import { EnderecoEntity } from '../entities/enderecoEntity';
import { UsuarioEntity } from '../entities/usuarioEntity';

export class EnderecoRepository {
  private repo = AppDataSource.getRepository(EnderecoEntity);
  private usuarioRepo = AppDataSource.getRepository(UsuarioEntity);

  async create(
    logradouro: string,
    numero: string,
    bairro: string,
    cep: string,
    uf: string,
    cidade: string,
    usuarioId?: number | null
  ) {
    const endereco = this.repo.create({
      logradouro,
      numero,
      bairro,
      cep,
      uf,
      cidade,
    } as Partial<EnderecoEntity>);

    if (usuarioId != null) {
      const usuario = await this.usuarioRepo.findOneBy({ id: usuarioId });
      if (usuario) {
        endereco.usuario = usuario;
      }
    }

    return this.repo.save(endereco);
  }

  async findAll() {
    return this.repo.find({
      relations: ['usuario'],
      order: { id: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number) {
    return this.repo.find({
      where: { usuario: { id: usuarioId } as any },
      relations: ['usuario'],
      order: { id: 'DESC' }
    });
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
