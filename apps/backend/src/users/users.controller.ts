/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@metavest/types/roles';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { UserOwned, UserOwnershipGuard } from 'src/authentication/ownership.guard';
import { UserStatusGuard } from 'src/authentication/user-status.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { User as UserDecorator } from "./user.decorator";
import { User, UserDocument } from './user.entry';
import { UserService } from './users.service';

/**
 * THIS IS super wrong, it takes info from params not from token
 * Improve on this
 */
@Controller('users')
@ApiTags('Users')
@UseGuards(AuthenticationGuard, RolesGuard, UserOwnershipGuard)
export class UsersController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('me')
    getProfile(@UserDecorator() user: UserDocument): Promise<UserDto> {
        return this.userService.findOne(user.email) as unknown as Promise<UserDto>;
    }

    @Get('all')
    @Roles(Role.Admin)
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Put(':id')
    @UserOwned()
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return await this.userService.updateProfile(id, updateUserDto);
    }


    @Delete(':id')
    @UserOwned()
    @UseGuards(UserStatusGuard)
    async delete(@Param('id') id: string): Promise<{ message: string; }> {
        await this.userService.delete(id);
        return { message: 'User deleted' };
    }

    @Roles(Role.Admin)
    @Put('roles/:id')
    @UserOwned()
    @UseGuards(UserStatusGuard)
    async updateRoles(@Param('id') id: string, @Body() roles: string[]): Promise<User> {
        return await this.userService.updateRoles(id, roles as Role[]);
    }

    @Roles(Role.Admin)
    @Put('status/:id')
    async updateStatus(@Param('id') id: string, @Body() status: string): Promise<User> {
        return await this.userService.updateStatus(id, status);
    }
}
