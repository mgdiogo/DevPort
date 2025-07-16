import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

interface jwtPayload {
	id: number;
	email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => req?.cookies?.['access_token']
			]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
		});
	}

	validate(payload: jwtPayload): jwtPayload {
		return payload;
	}
}