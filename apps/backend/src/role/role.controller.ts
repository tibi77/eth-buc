/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { UserStatusGuard } from 'src/authentication/user-status.guard';
import { User } from 'src/users/user.decorator';
import { UserService } from 'src/users/users.service';
import { CreateRoleAbilities } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller('roles')
@UseGuards(AuthenticationGuard, UserStatusGuard)
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly userService: UserService
    ) { }

    @Get("dashboard-items")
    @ApiOkResponse({ type: [String] })
    async getUnauthorizedDashboardItems(@User() user): Promise<string[]> {
        const userObject = await this.userService.getById(new Types.ObjectId(user._id));
        if (userObject) {
            return this.roleService.getUnauthorizedDashboardItems(userObject.roles);
        }
        return ["*"];
    }

    @Get("roles-abilities")
    @ApiOkResponse({ type: CreateRoleAbilities })
    async getRolesAbilities(@User() user): Promise<CreateRoleAbilities | null> {
        const userObject = await this.userService.getById(new Types.ObjectId(user._id));
        if (userObject) {
            return this.roleService.getRoleAbilities(userObject.roles);
        }
        return null;
    }

}
