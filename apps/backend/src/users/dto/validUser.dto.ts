import { createZodDto } from '@anatine/zod-nestjs';
import { ValidUserShape } from '@metavest/types/user';

export class ValidUserDto extends createZodDto(ValidUserShape) { }
