import { ApiKey } from "@prisma/client";

export type SafeKey = Pick<ApiKey, 'id' | 'projectId' | 'createdAt'>;