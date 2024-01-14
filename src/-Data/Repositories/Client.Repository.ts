import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { Client } from '@App/-Domain/Entities/Client.Model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from '../Entities/Clients';

export class ClientRepository implements IClientRepository {
	constructor(@InjectRepository(Clients) private Clients: Repository<Clients>) {}

	async findByApiId(apiId: string): Promise<Client> {
		return this.Clients.findOne({
			where: {
				ApiId: apiId
			}
		});
	}
}
