import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }


        const request = context.switchToHttp().getRequest<Request>();

        const user = request['user'];

        if (!user) {
            return false;
        }

        const allUserRoles = user.roles ?? [];
        if (allUserRoles.includes(Role.Admin)) {
            return true;
        }


        if (requiredRoles.some((role) => allUserRoles.includes(role))) {
            return true;
        }

        return false;
    }
}
