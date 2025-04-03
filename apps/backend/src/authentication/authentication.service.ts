import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@metavest/types/roles';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ValidUserDto } from 'src/users/dto/validUser.dto';
import { User } from 'src/users/user.entry';
import { UserService } from 'src/users/users.service';
import { LoginResponseShapeDto } from './dto/login.dto';
const FIVE_MINUTES = 5 * 60 * 1000;
@Injectable()
export class AuthenticationService {


    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }


    public async login(email: string, password: string): Promise<{ email: string; }> {
        try {

            const user = await this.validateUser(email, password);

            if (!user) {
                throw new UnauthorizedException();
            }

            let otp = this.generateNumericCode();
            if (process.env.NODE_ENV !== 'development') {
                await this.sendTwoFactorCode(email, otp);
            } else {
                otp = '123456';
            }
            await this.userService.saveTwoFactorCode(email, otp);

            return { email: user.email };
        } catch (error) {
            throw new UnauthorizedException();
        }
    }


    public async otpLogin(email: string, code: string): Promise<LoginResponseShapeDto> {
        try {
            const user = await this.userService.findOne(email);
            if (!user?.otp_expire_at || user.otp !== code || new Date(user.otp_expire_at).getTime() < Date.now()) {
                throw new UnauthorizedException('Invalid OTP code');
            }

            let access_token = '';
            if (user.status === 'active' ||
                user.status === 'onboarding'
            ) {
                const payload = {
                    email: user.email,
                    _id: user._id,
                    roles: user.roles,
                    status: user.status,
                };
                access_token = await this.jwtService.signAsync(payload, {
                    expiresIn: '14d'
                });
            }
            await this.userService.clearTwoFactorCode(email);

            return {
                access_token,
                email: user.email,
                status: user.status,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid OTP code');
        }
    }



    public async createUser(email: string, password: string) {
        try {
            const existingUser = await this.userService.findOne(email);
            if (existingUser) {
                throw new UnauthorizedException('Email already in use');
            }
            const user = await this.userService.create(email, password);

            const params = {
                Source: process.env.SYSTEM_EMAIL!,
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Subject: {
                        Data: 'metavest - New Account Created',
                    },
                    Body: {
                        Html: {
                            Data: `Dear Client, </br> Your account has just been created.
                            <br/> You can now login to your account using email: ${email} and password ${password} </br> Head over to <a href="https://metavest.com/login">/metavest</a> to get started. </br>
                            <br/> Regards, </br> metavest Team`,
                        },
                    },
                },
            };
            return user;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Error creating user');
        }
    }



    public async logout() {
        return { message: 'Logged out' };
    }


    private async validateUser(
        email: string,
        password: string
    ): Promise<ValidUserDto | null> {
        try {
            const user = await this.userService.findOne(email);
            if (user && (await bcrypt.compare(password, user.password))) {
                const result = { email: user.email };
                return result;
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }


    async passwordRecovery(email: string, password: string, confirmPassword: string): Promise<User> {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        if (
            !user.otp_verified_at ||
            new Date(user.otp_verified_at).getTime() - new Date().getTime() > FIVE_MINUTES
        ) {
            throw new UnauthorizedException('OTP has expired');
        }
        if (user?.status !== 'inactive') {
            throw new UnauthorizedException('User is not inactive');
        }
        if (password !== confirmPassword) {
            throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }
        user.otp_verified_at = undefined;
        user.password = password;
        user.status = 'onboarding';
        user.roles = [Role.BasicUser];
        return user.save();
    }

    private async sendTwoFactorCode(email: string, code: string) {
        const params = {
            Source: process.env.SYSTEM_EMAIL!,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: 'metavest - OTP Verification Code',
                },
                Body: {
                    Html: {
                        Data: `Dear Client, </br> Your one time password (OTP) is: <b>${code}</b>. </br> This code will expire in 5 minutes. </br> Regards, </br> metavest Team`,
                    },
                },
            },
        };

    }

    private generateNumericCode(): string {
        const buffer = randomBytes(3);
        const code = parseInt(buffer.toString('hex'), 16) % 1000000;
        return code.toString().padStart(6, '0');
    }


}
