import { Controller, Get } from "@nestjs/common";

@Controller()

export class AppController {
	@Get ()
	getRoot() {
		return { message: 'Hello from DevPort backend!' }
	}
}