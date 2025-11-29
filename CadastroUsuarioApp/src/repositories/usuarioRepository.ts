import { AppDataSource } from "../database/connection";
import { UsuarioEntity } from "../entities/usuarioEntity";

export class UsuarioRepository {
  private repo = AppDataSource.getRepository(UsuarioEntity);

  async create(payload: Partial<UsuarioEntity> ) {
  
    const user = this.repo.create({ ...payload } as Partial<UsuarioEntity>);
    return this.repo.save(user);
  }

  async findAll() {
    return this.repo.find({
      order: { nome: "ASC" }
    });
  }

  async update(id: number, patch: Partial<UsuarioEntity>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) return null;
    this.repo.merge(user, patch);
    return this.repo.save(user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
