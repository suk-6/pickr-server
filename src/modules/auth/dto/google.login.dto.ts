import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDTO {
  @IsString({ message: 'Invalid ID token' })
  @ApiProperty({ description: 'Google ID token' })
  idToken: string;
}
