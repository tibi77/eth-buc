import { createZodDto } from '@anatine/zod-nestjs';
import { PasswordRecoveryChecker } from '@metavest/types/authentication';
import { UpdateUserShape } from '@metavest/types/user';

export class UpdateUserDto extends createZodDto(UpdateUserShape) { }
export class UpdatePasswordDto extends createZodDto(PasswordRecoveryChecker) { }