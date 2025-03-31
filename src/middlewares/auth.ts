import asyncHandler from "../helpers/asyncHandler";
import { verifyToken } from "../utils/jwtUtils";
import { AuthFailureResponse, ForbiddenResponse } from "@utils/apiResponse";
import { Messages } from "@constants/response";

declare module "express" {
    interface Request {
        user?: { id: number; role: number };
    }
}

const authorize =
    (roles: number[]) =>
        asyncHandler(async (req, res, next) => {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return new AuthFailureResponse(Messages.auth.notProvidedToken).send(res);

            const userData = verifyToken(token);
            console.log("Decoded User Data:", userData);

            if (!userData || !roles.includes(userData.role?.id))
                return new ForbiddenResponse(Messages.auth.unauthorized).send(res);

            req.user = { id: userData.id, role: userData.role?.id };
            next();
        });

export const authAdmin = authorize([1]);
export const authEmployee = authorize([1, 2]);
export const authTenant = authorize([3]);
export const authGuestOrTenant = authorize([3, 4]);

