import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '@App/-Data/Entities/Users';

import { User } from '@App/-Domain/Entities/User.Model';
import { IUserRepository } from '@App/-Domain/Interfaces/Repositories/IUser.Repository';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(@InjectRepository(Users) private Users: Repository<Users>) {}
	
	FindByEmail(email: string): Promise<User> {
		return this.Users.findOne({
			where: {
				Email: email
			}
		});
	}
	
	FindById(id: number): Promise<User> {
		return this.Users.findOne({
			where: {
				Id: id
			}
		});
	}
	
	async Add(user: User): Promise<User> {
		const newUser = this.Users.create({
			Email: user.Email,
			FirstName: user.FirstName,
			LastName: user.LastName,
			ProfilePicPath: user.ProfilePicPath
		});
		return await this.Users.save(newUser);
	}
}
