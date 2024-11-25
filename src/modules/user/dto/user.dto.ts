import { IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { User } from '@prisma/client';

export class UserDTO implements User {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'User Login ID' })
  loginId: string;

  @IsString()
  @ApiProperty({ description: 'User Password' })
  password: string;

  @Matches(/^010-[0-9]{4}-[0-9]{4}$/)
  @ApiProperty({ description: 'User Phone Number (010-0000-0000)' })
  phone: string;

  @ApiProperty({ description: 'User Created At' })
  createdAt: Date;

  @ApiProperty({ description: 'User Updated At' })
  updatedAt: Date;
}
