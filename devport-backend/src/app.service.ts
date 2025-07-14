import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	getRoot(): string {
		return 'Hello from DevPort backend!';
	}
}