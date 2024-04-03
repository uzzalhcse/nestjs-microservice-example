import {
    Body,
    Controller,
    Get,
    HttpException,
    Inject,
    OnModuleInit,
    Post,
    Req,
    RequestTimeoutException,
    UseGuards
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { CreateOrder } from './dto/createOrder.dto';
import {AuthGuard} from "../auth/auth.gurd";

@Controller('order')
@ApiTags('Order')
export class OrderController implements OnModuleInit{

    constructor(
        @Inject('ORDER') private readonly orderClient: ClientKafka,
    ) { }

    onModuleInit() {
        ['create_order', 'my_order'].forEach(action => this.orderClient.subscribeToResponseOf(action));
    }
    @Post("/create")
    @UseGuards(AuthGuard)
    @ApiBody({ type: CreateOrder })
    @ApiBearerAuth()
    async createOrder(@Req() request, @Body() body: CreateOrder): Promise<Observable<any>> {
        return this.invokeOrderClient("create_order", { ...body, userId: request?.user?._id });
    }

    @Get("/my-orders")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async myOrders(@Req() request): Promise<Observable<any>> {
        return this.invokeOrderClient("my_order", { userId: request?.user?._id });
    }

    private async invokeOrderClient(action: string, data: any): Promise<Observable<any>> {
        return this.orderClient.send(action, data)
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
