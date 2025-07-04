import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { HttpExceptionFilter } from './common/filters';
import { MAX_REQUEST_BY_MINUTE, ONE_MINUTE_TO_MS } from './common/helpers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: ONE_MINUTE_TO_MS,
        limit: MAX_REQUEST_BY_MINUTE,
      },
    ]),
    CommonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
