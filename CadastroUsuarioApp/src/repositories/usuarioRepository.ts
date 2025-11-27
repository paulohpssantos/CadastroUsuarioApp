import { AppDataSource } from "../database/connection";
import { UsuarioEntity } from "../entities/usuarioEntity";
import { EnderecoEntity } from "../entities/enderecoEntity";

export class UsuarioRepository {
  private repo = AppDataSource.getRepository(UsuarioEntity);

  async create(nome: string, telefone: string, senha: string, email: string, enderecos?: Partial<EnderecoEntity>[]) {
    const user = this.repo.create({
      nome,
      telefone,
      senha,
      email,
      enderecos
    });
    return this.repo.save(user);
  }

  async findAll() {
    return this.repo.find({
      relations: ['enderecos'],
      order: { nome: "ASC" }
    });
  }

  async update(id: number, patch: Partial<UsuarioEntity>) {
    
    const user = await this.repo.findOne({ where: { id }, relations: ['enderecos'] });
    if (!user) return null;
    this.repo.merge(user, patch);
    return this.repo.save(user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
