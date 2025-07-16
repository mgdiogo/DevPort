import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { LoginUserDto } from "../dto/login-user.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	validate(email: string, password: string) {
		return this.authService.validateUserLogin(email, password); 
	}
}