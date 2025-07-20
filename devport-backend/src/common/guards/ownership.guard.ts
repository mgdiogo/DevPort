import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Request } from 'express';

@Injectable()
export class OwnershipGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean {
		const req = context.switchToHttp().getRequest<Request>();
		const user = req.user as { id: number }

		if (user.id.toString() !== req.params.id)
			throw new ForbiddenException('Cannot perform this operation')
		
		return true;
	}
}