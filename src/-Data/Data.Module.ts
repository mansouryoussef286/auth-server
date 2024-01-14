import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from '@App/Config/App.Config';

import { Users } from '@App/-Data/Entities/Users';
import { Clients } from '@App/-Data/Entities/Clients';
import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { ClientRepository } from './Repositories/Client.Repository';

const Entities = [Users, Clients];

@Module({
	imports: [TypeOrmModule.forFeature(Entities)],
	providers: [
		AppConfig,
		ClientRepository,
		{
			provide: IClientRepository,
			useClass: ClientRepository
		}
	],
	exports: [TypeOrmModule.forFeature(Entities)] //to use entities outside of the module
})
export class DataModule {}
