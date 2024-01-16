import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Clients } from '@App/-Data/Entities/Clients';

import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { Client } from '@App/-Domain/Entities/Client.Model';

@Injectable()
export class ClientRepository implements IClientRepository {
	constructor(@InjectRepository(Clients) private Clients: Repository<Clients>) {}

	async FindByApiId(apiId: string): Promise<Client> {
		return this.Clients.findOne({
			where: {
				ApiId: apiId
			}
		});
	}
}
