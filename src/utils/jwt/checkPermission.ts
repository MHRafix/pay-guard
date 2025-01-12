import { NextApiRequest, NextApiResponse } from 'next';
import { checkRole, verifyToken } from './RoleGuard';

export const isAuthenticated = (
	req: NextApiRequest,
	res: NextApiResponse,
	roles: string[]
) => {
	const token = req.headers?.authorization?.split('Bearer ')[1];
	const user = verifyToken(token!);

	// throw err
	if (!user) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}

	// check has access
	const hasAccess = checkRole(token!, roles);

	if (!hasAccess) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}
};
