import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private orderService:OrderService){}

    @MessagePattern("create_order")
    async createOrder(@Payload() data: any){

        console.log('create_order',data);


        return this.orderService.createOrder(data)

    }
    @MessagePattern("my_order")
    async myOrders(@Payload() data: any){

        console.log(data);


        return this.orderService.myOrders(data)

    }
}
