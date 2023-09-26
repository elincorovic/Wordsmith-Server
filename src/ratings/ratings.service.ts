import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createRating(dto: CreateRatingDto, username: string) {
    try {
      const rating = await this.prisma.rating.create({
        data: {
          ...dto,
          username: username,
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          if (error.meta.field_name === 'Rating_bookSlug_fkey (index)') {
            throw new BadRequestException('No book with this slug');
          }
        }
        if (error.code === 'P2002') {
          throw new ForbiddenException('You have already rated this book');
        }
      }
      throw error;
    }
  }

  async deleteRating(slug: string, username: string) {
    try {
      const rating = await this.prisma.rating.delete({
        where: {
          username_bookSlug: {
            username: username,
            bookSlug: slug,
          },
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new BadRequestException('Rating does not exist');
        }
        if (error.code === 'P2025') {
          throw new BadRequestException('Rating does not exist');
        }
      }
      throw error;
    }
  }
}
