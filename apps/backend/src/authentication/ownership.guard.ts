import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Model, Types } from 'mongoose';
export const USER_OWNED_KEY = 'userOwned';
/**
 * To use this guard, you need to add the `UserOwned` decorator to your route handler.
 * The root needs to have the id parameter.
 * @returns 
 */
export const UserOwned = () => SetMetadata(USER_OWNED_KEY, true);

@Injectable()
export class UserOwnershipGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isUserOwned = this.reflector.get<boolean>(
            USER_OWNED_KEY,
            context.getHandler(),
        );

        if (!isUserOwned) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (request.user?.roles.includes('admin')) {
            return true;
        }
        const userId = request.user?._id; // Assuming you have user info from your auth guard
        const resourceId = request.params.id;


        if (!userId || !resourceId) {
            throw new ForbiddenException('Access denied');
        }

        const model = this.getModelFromContext(context);

        const resource = await model.findOne({
            _id: new Types.ObjectId(resourceId)
        });

        if (!resource) {
            throw new ForbiddenException('Resource not found');
        }

        if ((
            resource.user_id ?? resource._id ?? ""
        ).toString() !== userId.toString()) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }

    private getModelFromContext(context: ExecutionContext): Model<any> {
        const controller = context.getClass();
        const controllerInstance = this.moduleRef.get(controller, { strict: false });
        const serviceKey = Object.getOwnPropertyNames(controllerInstance)[0] ?? "";
        const modelKey = `${serviceKey?.toLocaleLowerCase()?.replace('service', 'Model')}`;

        if (controllerInstance[serviceKey][modelKey]) {
            return controllerInstance[serviceKey][modelKey];
        }

        throw new ForbiddenException('Model not found');
    }

}