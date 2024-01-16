import { Injectable } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { Client } from '@App/-Domain/Entities/Client.Model';

@Injectable()
export class ClientsService {
	constructor(
		private AppConfig: AppConfig,
		private ClientRepository: IClientRepository
	) {}

	async FindByApiId(apiId: string): Promise<Client> {
		return this.ClientRepository.FindByApiId(apiId);
	}
}
