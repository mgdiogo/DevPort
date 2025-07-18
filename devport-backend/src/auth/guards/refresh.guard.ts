import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";

@Injectable()
export class RefreshGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService, @InjectRedis() private readonly redis: Redis) { }
	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const refreshToken = req.cookies['refresh_token'];
		if (!refreshToken)
			throw new UnauthorizedException('Missing refresh token');

		const decoded = this.jwtService.decode(refreshToken) as { jti?: string, exp?: number };
		if (!decoded.jti)
			throw new UnauthorizedException('Token is missing JTI');

		const blacklisted = await this.redis.get(`bl:jti:${decoded.jti}`);
		if (blacklisted)
			throw new UnauthorizedException('Token is blacklisted');

		try {
			const payload = this.jwtService.verify(refreshToken, {secret: process.env.JWT_SECRET!,});

			req.user = payload;
			return true;
		} catch {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}
	}
}