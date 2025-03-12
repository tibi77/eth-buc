import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [
        PassportModule,
        UserModule,
        RoleModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }),
    ],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController]
})
export class AuthenticationModule { }
