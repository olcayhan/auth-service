import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async deleteAll() {
    await this.prisma.user.deleteMany();
    return 'All users deleted!';
  }

  async activate(token: string) {
    const decoded = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = true;
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return 'Hesap başarıyla aktifleştirildi!';
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const email = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (email) {
        throw new NotFoundException('Email already exists!');
      }

      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      const payload = { id: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload);

      await this.mailerService.sendMail({
        to: user.email,
        from: 'noreply@authservice.com',
        subject: 'Hesap Aktivasyonu',
        html: `
        <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>E-posta Doğrulama</title>
          </head>
          <body>
              <h1>Merhaba, ${user.name}</h1>
              <p>E-posta adresinizi doğrulamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
              <a href="http://localhost:3000/auth/verify?token=${token}">E-posta doğrulama linki</a>
              <p>Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı görmezden gelin.</p>
          </body>
          </html>
          `,
      });

      return {
        access_token: token,
      };
    } catch (e) {
      console.log(e);
      throw new NotFoundException(e);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.password !== loginUserDto.password) {
      throw new NotFoundException('Password is incorrect!');
    }

    if (user.isActive === false) {
      throw new NotFoundException('User is not active!');
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
