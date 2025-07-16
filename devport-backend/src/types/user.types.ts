import { User } from "@prisma/client";

export type SafeUser = Pick<User, 'id' | 'email' | 'display_name'>;