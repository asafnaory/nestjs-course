import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';


const MONGO_URI = 'mongodb://localhost:27017/nest-crud-demo';
const mongooseOptions: MongooseModuleOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI,mongooseOptions), PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
