import { createZodDto } from '@anatine/zod-nestjs';
import { UserShape } from '@metavest/types/user';

export class UserDto extends createZodDto(UserShape) { }
