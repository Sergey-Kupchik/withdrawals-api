import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './validation/http-exception.filter';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errors4Response = [];
        errors.forEach((e) => {
          const keys = Object.keys(e.constraints);
          keys.forEach((k) => {
            errors4Response.push({
              field: e.property,
              message: e.constraints[k],
            });
          });
        });
        throw new BadRequestException(errors4Response);
      },
    }),
  );
  const port = parseInt(configService.get('PORT'), 10);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
