import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    const category = query.category ? query.category.split(',') : null;
    const fromYear = query.fromYear ? parseInt(query.fromYear) : null;
    const toYear = query.toYear ? parseInt(query.toYear) : null;
    const fromRating = query.fromRating ? parseInt(query.fromRating) : null;
    const toRating = query.toRating ? parseInt(query.toRating) : null;

    let filterObj: any = {};
    if (category) {
      filterObj.categories = {
        some: {
          title: {
            in: category,
          },
        },
      };
    }
    if (fromYear && toYear) {
      filterObj.year = {
        gte: fromYear,
        lte: toYear,
      };
    } else if (fromYear) {
      filterObj.year = {
        gte: fromYear,
      };
    } else if (toYear) {
      filterObj.year = {
        lte: toYear,
      };
    }

    const books = await this.prisma.book.findMany({
      where: filterObj,
    });

    return books;
  }

  async getBook(bookId: number) {
    const book = this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        ratings: true,
      },
    });

    return book;
  }
}
