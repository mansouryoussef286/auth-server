import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from '@App/Config/App.Config';

import { Users } from '@App/-Data/Entities/Users';
import { Clients } from '@App/-Data/Entities/Clients';
import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { ClientRepository } from './Repositories/Client.Repository';
import { IUserRepository } from '@App/-Domain/Interfaces/Repositories/IUser.Repository';
import { UserRepository } from './Repositories/User.Repository';

const Entities = [Users, Clients];

@Module({
	imports: [TypeOrmModule.forFeature(Entities)],
	providers: [
		AppConfig,
		ClientRepository,
		{
			provide: IClientRepository,
			useClass: ClientRepository
		},
		{
			provide: IUserRepository,
			useClass: UserRepository
		}
	],
	exports: [TypeOrmModule.forFeature(Entities), IClientRepository, IUserRepository] //to use entities outside of the module
})
export class DataModule {}
