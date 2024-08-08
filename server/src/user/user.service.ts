import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const email = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (email) {
      return 'Email already exists!';
    }

    const data = await this.prisma.user.create({
      data: createUserDto,
    });
    return data;
  }

  async findAll() {
    const data = await this.prisma.user.findMany();
    return data;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    delete user.password;
    return user;
  }

  update(id: number, updateUserDto: User) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    delete user.password;
    return user;
  }
}
