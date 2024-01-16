import { Client } from '@App/-Domain/Entities/Client.Model';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IClientRepository {
	abstract FindByApiId(apiId: string): Promise<Client>;
}
