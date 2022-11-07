import { Body, Controller, Get, HttpException, Inject, Post, Req, RequestTimeoutException, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { catchError, Observable, of, timeout, TimeoutError } from 'rxjs';
import { AuthGuard } from '../auth/auth.gurd';
import { CreateOrder } from './dto/createOrder.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {

    constructor(
        @Inject('ORDER') private readonly orderClient: ClientProxy,
        //private readonly authService: AuthService
    ) { }


    @Post("/create")
    @UseGuards(AuthGuard)
    @ApiBody({ type: CreateOrder })
    @ApiBearerAuth()
    private async createOrder(@Req() data, @Body() body: CreateOrder): Promise<Observable<any>> {
        return this.orderClient
        .send("create_order",{...data.body,userId:data?.user?._id})
        .pipe(
            timeout(5000),
            catchError(err => {
                if (err instanceof TimeoutError) {
                     throw new RequestTimeoutException()
                }
                throw new HttpException({message:[err.message]}, err.status)
        }))
       
    }



    
    @Get("/my-orders")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    private async myOrders(@Req() data): Promise<Observable<any>> {
        return this.orderClient
        .send("my_order",{userId:data?.user?._id})
        .pipe(
            timeout(5000),
            catchError(err => {
                if (err instanceof TimeoutError) {
                     throw new RequestTimeoutException()
                }
                throw new HttpException({message:[err.message]}, err.status)
        }))
       
    }
}
