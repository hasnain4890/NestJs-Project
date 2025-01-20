import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { ApiKeyMiddleware } from './common/middleware/apikey.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilters } from './common/exception-filters/exception.filters';
import { UppercaseValidationPipe } from './common/pipes/uppercase-validation.pipes';
import { RolesGuard } from './common/guards/role.guards';
import { CustomInterceptor } from './common/interceptors/custom.interceptor';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ProductModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    //     ConfigModule.forRoot({
    //       validationSchema: Joi.object({
    //         NODE_ENV: Joi.string()
    //           .valid('development', 'production', 'test', 'provision')
    //           .default('development'),
    //         PORT: Joi.number().port().default(3000),
    //       }),
    //       validationOptions: {
    //         allowUnknown: false,
    //         abortEarly: true,
    //       },
    //     }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs',
      //       entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CustomExceptionFilters },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomInterceptor,
    },
    // { provide: APP_PIPE, useClass: UppercaseValidationPipe },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST })
      .forRoutes('users');
  }
}
