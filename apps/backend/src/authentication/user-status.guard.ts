import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.error('No token found');
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,

            });
            if (payload["status"] === "onboarding") {
                throw new UnauthorizedException();
            }
            if (payload["status"] !== "active") {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.error('Invalid token', error);
            throw new UnauthorizedException();
        }
        return true;
    }
}
