import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import '@nestjs/platform-express';
import {RedirectRepository} from "./repository.ts";
import {RedirectController} from "./controller.ts";

@Module({
  providers: [RedirectRepository],
  controllers: [RedirectController],
})
class AppModule {}
const app = await NestFactory.create(AppModule);
app.listen(3000);
