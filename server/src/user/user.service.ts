import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (email) {
      return 'Email already exists!';
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    const payload = { id: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      return 'User not found!';
    }

    if (user.password !== loginUserDto.password) {
      return 'Password is incorrect!';
    }

    const payload = { id: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findAll() {
    const data = await this.prisma.user.findMany();
    data.forEach((user) => {
      delete user.password;
    });
    return data;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return 'User not found!';
    }

    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    delete user.password;
    return user;
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
