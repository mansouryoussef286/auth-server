import { Module } from '@nestjs/common';
import { AuthController } from './Auth.Controller';
import { DomainModule } from '@App/-Domain/Domain.Module';

@Module({
	imports: [DomainModule],
	controllers: [AuthController],
	providers: []
})
export class AuthModule {}
