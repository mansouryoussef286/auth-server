import { Injectable } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { IUserRepository } from '@App/-Domain/Interfaces/Repositories/IUser.Repository';
import { Auth0Models } from '@App/-Domain/Models/Auth0.Models';
import { User } from '@App/-Domain/Entities/User.Model';

@Injectable()
export class UsersService {
	constructor(
		private AppConfig: AppConfig,
		private UserRepository: IUserRepository
	) {}

	FindByEmail(email: string): Promise<User> {
		return this.UserRepository.FindByEmail(email);
	}

	Add(user: User): Promise<User> {
		return this.UserRepository.Add(user);
	}

	async CheckUserInDB(user: Auth0Models.ProviderUser) {
		let dbUser = await this.FindByEmail(user.email);
		if (!dbUser) {
			let newUser: User = {
				Id: 0,
				Email: user.email,
				FirstName: user.given_name,
				LastName: user.family_name,
				ProfilePicPath: user.picture
			};
			let createdUser = await this.Add(newUser);
		}
	}
}
