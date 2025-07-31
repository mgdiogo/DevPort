import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service';
import { SafeKey } from 'src/types/apiKey.types';

@Injectable()
export class ApiKeysService {
	constructor(private prisma: PrismaService) { }

	async getApiKeysById(id: number): Promise<SafeKey[]> {
		return this.prisma.apiKey.findMany({
			where: {
				id: id
			}
		})
	}
}
