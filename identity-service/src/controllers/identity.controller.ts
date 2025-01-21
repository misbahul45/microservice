import { Handler, Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';
import { ZOD_VALIDATION } from '../validation/zod.validation';
import { VALIDATE_IDENTITY } from '../validation/identity.validate';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { hashPassword } from '../utils/argon2.util';
import generateToken from '../utils/generateToken';

class USER_CONTROLLER {
  // Register
  static async REGISTER(req: Request, res: Response, next: NextFunction): Promise<void> {
    Logger.info('Register User endpoint...');
    try {
      const result = ZOD_VALIDATION.validate(VALIDATE_IDENTITY.REGISTER, req.body);

      if (!result || !result.email || !result.username || !result.password) {
        throw new AppError('Invalid user data provided', 400);
      }

      const userCount = await prisma.user.count({
        where: {
          email: result.email,
        },
      });

      if (userCount > 0) {
        throw new AppError('User already exists', 400);
      }

      result.password = await hashPassword(result.password);

      const user = await prisma.user.create({
        data: {
          username: result.username,
          email: result.email,
          password: result.password,
        },
      });

      Logger.info('User created successfully', result.username);

      const { accessToken, refreshToken } = await generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default USER_CONTROLLER;
