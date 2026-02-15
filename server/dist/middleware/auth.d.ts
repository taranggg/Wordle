import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User.js";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare function protect(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map