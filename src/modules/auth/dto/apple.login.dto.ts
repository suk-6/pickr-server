import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AppleLoginDTO {
  @IsString({ message: 'Invalid ID token' })
  @ApiProperty({ description: 'Apple ID token' })
  idToken: string;
}
