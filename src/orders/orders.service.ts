import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';
import { FindAllOrderDto } from './dto/find-all-order.dto';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) 
    private orderSchema: Model<Order>
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderSchema.create({
      ...createOrderDto,
      wallet: createOrderDto.walletId,
      asset: createOrderDto.assetId,
      partial: createOrderDto.shares,
      status: OrderStatus.PENDING,
    });
  }

  findAll(filter: FindAllOrderDto) {
    return this.orderSchema
      .find({ wallet: filter.walletId })
      .populate('asset') as Promise<(Order & { asset: Asset })[]>;
  }

  findOne(id: string) {
    return this.orderSchema.findById(id);
  }
}
