import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Book } from './book.model';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book) private booksRepository: typeof Book,
    @InjectModel(User) private userRepository: typeof User,
  ) {}
  async publish(dto: CreateBookDto, id: number) {
    return await this.booksRepository.create({
      creatorId: id,
      ...dto,
    });
  }

  async booksByAuthor(id: number, row: number) {
    const author = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!author) {
      throw new HttpException(
        'Пользователь не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.booksRepository.findAll({
      where: {
        creatorId: id,
      },
      order: [['id', 'desc']],
      offset: 20 * row,
      limit: 20,
    });
  }
}
