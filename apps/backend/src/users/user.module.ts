import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.entry';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

@Module({
    imports: [MongooseModule.forFeature(
        [{
            name: User.name,
            schema: UserSchema
        }]
    )],
    exports: [UserService],
    providers: [UserService],
    controllers: [UsersController]
})
export class UserModule { }
