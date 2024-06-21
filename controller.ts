import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RedirectRepository } from './repository.ts';

class CreateDto {
  url: string;
  name: string;
}

class RedirectDto {
  url: string;
  created: Date;
}

@Controller()
export class RedirectController {
  constructor(private redirectRepo: RedirectRepository) {}

  @Get('/')
  get(): Promise<RedirectDto[]> {
    return this.redirectRepo.list();
  }

  @Get('/:name')
  getName(@Param('name') name: string): Promise<RedirectDto[]> {
    return this.redirectRepo.list(name);
  }

  @Post('/')
  create(@Body() body: CreateDto): Promise<RedirectDto> {
    return this.redirectRepo.create(body.url, body.name);
  }
}
