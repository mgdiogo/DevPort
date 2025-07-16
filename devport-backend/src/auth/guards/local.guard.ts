import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { LoginUserDto } from "../dto/login-user.dto";

@Injectable()
export class LocalGuard extends AuthGuard('local') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const loginDto = plainToInstance(LoginUserDto, request.body);

		const errors = await validate(loginDto);
		if (errors.length > 0) {
			const message = errors.map(err => Object.values(err.constraints ?? {}))
			throw new UnauthorizedException(message);
		}

		return super.canActivate(context) as Promise<boolean>;
	}
}