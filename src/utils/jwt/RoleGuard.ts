import jwt from 'jsonwebtoken';

export interface DecodedToken {
	id: string;
	email: string;
	role: string;
}

export function verifyToken(token: string): DecodedToken | null {
	try {
		return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
	} catch (error) {
		return null;
	}
}

export function checkRole(token: string, allowedRoles: string[]): boolean {
	const decoded = verifyToken(token);
	if (!decoded) {
		return false;
	}
	return allowedRoles.includes(decoded.role);
}
