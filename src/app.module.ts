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

@Module({
  imports: [UserModule],
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
