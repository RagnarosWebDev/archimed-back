import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import { User } from '../users/user.model';
import { Book } from './book.model';
import { Roles } from '../auth/roles-auth.decorator';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
@ApiBearerAuth()
@ApiTags('Книги')
export class BookController {
  constructor(
    private bookService: BookService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Публикация книги' })
  @ApiResponse({ status: 200, type: Book })
  @Post('/publish')
  @UseGuards(RolesGuard)
  @Roles('AUTHOR')
  async publish(@Req() req: Request, @Body() dto: CreateBookDto) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return await this.bookService.publish(dto, user.id);
  }

  @ApiOperation({ summary: 'Посмотреть список книг автор' })
  @ApiResponse({ status: 200, type: [Book] })
  @Get('/allAuthorBooks')
  @UseGuards(RolesGuard)
  async allAuthorBooks(
    @Req() req: Request,
    @Query('id') id: number,
    @Query('row') row: number,
  ) {
    return await this.bookService.booksByAuthor(id, row);
  }

  @ApiOperation({ summary: 'Посмотреть своих список книг' })
  @ApiResponse({ status: 200, type: [Book] })
  @Get('/myBooks')
  @UseGuards(RolesGuard)
  @Roles('AUTHOR')
  async myBooks(@Req() req: Request, @Query('row') row: number) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return await this.bookService.booksByAuthor(user.id, row);
  }
}
