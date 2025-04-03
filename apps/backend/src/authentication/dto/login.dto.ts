import {createZodDto} from '@anatine/zod-nestjs';
import {LoginResponseShape} from '@metavest/types/authentication';

export class LoginResponseShapeDto extends createZodDto(LoginResponseShape) {}
