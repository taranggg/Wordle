import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator";
export declare const signinValidation: ValidationChain[];
export declare const signupValidation: ValidationChain[];
export declare function handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=validateAuth.d.ts.map