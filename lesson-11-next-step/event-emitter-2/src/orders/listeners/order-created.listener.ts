import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.*')
  // @OnEvent('**')
  // @OnEvent('order.created', { async: true })
  // @OnEvent('order.created')
  handleOrderCreatedEvent(event: OrderCreatedEvent): OrderCreatedEvent {
    // handle and process "OrderCreatedEvent" event
    console.log('received order.created', event);
    return event;
  }
}
