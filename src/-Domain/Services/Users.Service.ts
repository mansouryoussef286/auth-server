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

	private FindByEmail(email: string): Promise<User> {
		return this.UserRepository.FindByEmail(email);
	}

	FindById(id: number): Promise<User> {
		return this.UserRepository.FindById(id);
	}

	private Add(user: User): Promise<User> {
		return this.UserRepository.Add(user);
	}

	private Update(user: User): Promise<User> {
		return this.UserRepository.Update(user);
	}

	async CheckUserInDBByEmail(user: Auth0Models.ProviderUser): Promise<User> {
		let dbUser = await this.FindByEmail(user.email);
		if (!dbUser) {
			let newUser: User = {
				Id: 0,
				Email: user.email,
				FirstName: user.given_name,
				LastName: user.family_name,
				ProfilePicPath: user.picture,
				Auth0RefreshToken: user.refresh_token
			};
			let createdUser = await this.Add(newUser);
			return createdUser;
		} else {
			dbUser.Auth0RefreshToken = user.refresh_token;
			dbUser.FirstName = user.given_name;
			dbUser.LastName = user.family_name;
			dbUser.ProfilePicPath = user.picture;
			await this.Update(dbUser);
		}
		return dbUser;
	}

	async UpdateUserFromIp(user: Auth0Models.ProviderUser): Promise<User> {
		let updatedUser: User = {
			Id: user.Id,
			Email: user.email,
			FirstName: user.given_name,
			LastName: user.family_name,
			ProfilePicPath: user.picture,
			Auth0RefreshToken: user.refresh_token
		};
		await this.Update(updatedUser);
		return updatedUser;
	}
}
