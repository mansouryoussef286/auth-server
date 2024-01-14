import { Client } from '@App/-Domain/Entities/Client.Model';

export abstract class IClientRepository {
	abstract findByApiId(apiId: string): Promise<Client>;
}
