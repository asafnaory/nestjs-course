import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: true,
      // the delimiter used to segment namespaces
      delimiter: '.',
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
