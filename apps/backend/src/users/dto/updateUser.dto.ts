import { createZodDto } from '@anatine/zod-nestjs';
import { PasswordRecoveryChecker } from '@bookIt/types/authentication';
import { UpdateUserShape } from '@bookIt/types/user';

export class UpdateUserDto extends createZodDto(UpdateUserShape) { }
export class UpdatePasswordDto extends createZodDto(PasswordRecoveryChecker) { }