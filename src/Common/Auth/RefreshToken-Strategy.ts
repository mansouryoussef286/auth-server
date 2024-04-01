import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfig } from '@App/Config/App.Config';
import { Request } from 'express';
import * as fs from 'fs';
import { AuthenticationModels } from '@App/-Domain/Models/Authentication.Models';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly AppConfig: AppConfig) {
		const publicKey = fs.readFileSync('Keys/certificate.pem', 'utf8');

		super({
			jwtFromRequest: ExtractJwt.fromBodyField('RefreshToken'),
			ignoreExpiration: false,
			secretOrKey: publicKey,
			passReqToCallback: true
		});
	}

	async validate(req: Request, user: AuthenticationModels.JwtRefreshToken) {
		return user;
	}
}
