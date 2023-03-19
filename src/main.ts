import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";
import {LoggingInterceptor} from "./infrastructure/common/interceptors/logger.interceptor";
import {AllExceptionFilter} from "./infrastructure/common/filter/exception.filter";
import {ILOGGER_TOCKEN} from "./domain/logger/logger.interface";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const loggerService = app.get(ILOGGER_TOCKEN);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new AllExceptionFilter(loggerService));

    app.useGlobalInterceptors(new LoggingInterceptor(loggerService));

    const config = new DocumentBuilder()
        .setTitle('wtx backend tech challenge')
        .setDescription('Trucks service')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config,
        {
            deepScanRoutes: true,
        }
    );
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get<number>('SERVER_PORT'));
}

bootstrap();
