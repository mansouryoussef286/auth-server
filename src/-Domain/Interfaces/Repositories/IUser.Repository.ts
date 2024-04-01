import { User } from '@App/-Domain/Entities/User.Model';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUserRepository {
	abstract FindByEmail(email: string): Promise<User>;
	abstract FindById(id: number): Promise<User>;
	abstract Add(user: User): Promise<User>;
	abstract Update(user: User): Promise<User>;
}
