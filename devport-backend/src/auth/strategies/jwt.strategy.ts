import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

export interface jwtPayload {
	id: number;
	display_name: string;
	jti?: string;
	token_type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
		});
	}

	validate(payload: jwtPayload): jwtPayload {
		if (payload.token_type !== 'access')
			throw new UnauthorizedException('Invalid token type');
		return payload;
	}
}