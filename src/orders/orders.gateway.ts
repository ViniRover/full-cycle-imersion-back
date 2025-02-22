import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  constructor(private orderService: OrdersService) {}

  @SubscribeMessage('orders/create')
  async handleMessage(client: any, payload: CreateOrderDto): Promise<Order> {
    const order = await this.orderService.create({
      assetId: payload.assetId,
      walletId: payload.walletId,
      type: payload.type,
      shares: payload.shares,
      price: payload.price,
    });

    return order;
  }
}
