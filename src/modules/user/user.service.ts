import { Injectable } from '@nestjs/common';

import { Prisma, Provider } from '@prisma/client';

import { PrismaService } from '@common/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneById(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  public async findOneByProvider(provider: Provider, providerId: string) {
    return await this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  public async create(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data: user,
    });
  }
}
