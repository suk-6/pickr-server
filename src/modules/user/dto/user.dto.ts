import { ApiProperty } from '@nestjs/swagger';

import { $Enums, User } from '@prisma/client';

export class UserDTO implements User {
  @ApiProperty({ description: '사용자 ID (UUID)' })
  id: string;

  @ApiProperty({ description: 'OAuth Platform' })
  provider: $Enums.Provider;

  @ApiProperty({ description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({ description: '사용자 생성일' })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일' })
  updatedAt: Date;
}
