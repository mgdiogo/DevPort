import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
	const salt = bcrypt.genSaltSync();
	return bcrypt.hash(password, salt);
}