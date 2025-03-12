import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from 'src/role/role.enum';
import { User, UserDocument } from 'src/users/user.entry';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) { }

    async findAll(): Promise<User[]> {
        return await this.userModel.find({});
    }

    async findOne(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async create(email: string, password: string): Promise<User> {
        const user = await this.userModel.create({
            _id: new Types.ObjectId(),
            email, password
        });
        return user.save();
    }

    async updateProfile(_id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        // remove _id, roles and status from the update data
        const { _id: _, roles: _roles, status: _status, ...updateData } = updateUserDto;
        const prevUser = await this.userModel.findById(
            new Types.ObjectId(_id)
        );
        if (!prevUser) {
            throw new NotFoundException(`User with ID ${_id} not found`);
        }

        if (prevUser.status === "active" || prevUser.status === "onboarding") {
            prevUser.set(updateData);
            prevUser.status = "active";
            if (!prevUser.roles || prevUser.roles.length === 0) {
                prevUser.roles = [Role.BasicUser];
            }
            return await prevUser.save();
        }

        throw new NotFoundException(`User with ID ${_id} is not active`);
    }

    async updateStatus(id: string, status: string): Promise<User> {
        const newUser = await this.userModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!newUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return newUser;
    }


    async updateRoles(id: string, roles: Role[]): Promise<User> {
        const newUser = await this.userModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: { roles } },
            { new: true, runValidators: true }
        );

        if (!newUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return newUser;
    }
    async delete(id: string): Promise<void> {
        const result = await this.userModel.deleteOne({ where: { id } });
        if (result.deletedCount === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async getProfile(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async getById(id: Types.ObjectId): Promise<User | null> {
        const user = this.userModel.findById(id);
        return user;
    }

    async getRoles(id: string): Promise<Role[]> {
        const currentUser = await this.getById(
            new Types.ObjectId(id)
        );
        const userRoles = currentUser?.roles;
        return userRoles ?? [];
    }

    async saveTwoFactorCode(email: string, code: string): Promise<void> {
        await this.userModel.updateOne({ email }, {
            otp: code,
            otp_expire_at: Date.now() + 300000 // 5 minutes 
        });
    }

    async clearTwoFactorCode(email: string): Promise<void> {
        await this.userModel.updateOne({ email }, { otp: null, otp_expire_at: null, otp_verified_at: Date.now() });
    }
}
