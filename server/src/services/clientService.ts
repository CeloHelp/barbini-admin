import { AppError } from "../lib/http.js";
import { clientRepository } from "../repositories/clientRepository.js";
import { serializeClient } from "./serializers.js";

export const clientService = {
  async list(search?: string) {
    return (await clientRepository.list(search)).map(serializeClient);
  },
  async find(id: string) {
    const client = await clientRepository.find(id);
    if (!client) throw new AppError(404, "Cliente nao encontrado");
    return serializeClient(client);
  },
  async create(data: { name: string; phone: string; email: string; notes: string }) {
    return serializeClient(await clientRepository.create(data));
  },
  async update(id: string, data: { name: string; phone: string; email: string; notes: string }) {
    await this.find(id);
    return serializeClient(await clientRepository.update(id, data));
  },
  async remove(id: string) {
    await this.find(id);
    await clientRepository.remove(id);
  },
};
