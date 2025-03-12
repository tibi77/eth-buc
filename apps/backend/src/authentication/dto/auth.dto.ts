import { createZodDto } from '@anatine/zod-nestjs';
import { AuthenticationShape, AuthenticationShapeOtp, PasswordRecoveryChecker } from '@bookIt/types/authentication';

export class AuthenticationShapeDto extends createZodDto(AuthenticationShape) { }
export class PasswordRecoveryCheckerDto extends createZodDto(PasswordRecoveryChecker) { }
export class AuthenticationShapeOtpDto extends createZodDto(AuthenticationShapeOtp) { }

export class SignInResponseShapeDto {
    email!: string;
}
