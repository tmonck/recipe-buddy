import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { RecipesModule } from './recipes/recipes.module';
import { GrocyService } from './grocy/grocy.service';
import { GrocyController } from './grocy/grocy.controller';
import { RecipesService } from './recipes/recipes.service';
import { RecipesController } from './recipes/recipes.controller';
import { GrocyModule } from './grocy/grocy.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017/'),
    AuthModule,
    UsersModule,
    RecipesModule,
    GrocyModule,
  ],
  providers: [
    AppService,
    UsersService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
