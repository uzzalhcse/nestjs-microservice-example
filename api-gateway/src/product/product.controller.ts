import {
    Body,
    Controller,
    Get,
    HttpException,
    Inject, OnModuleInit,
    Post,
    Request,
    RequestTimeoutException,
    UseGuards
} from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.gurd';
import { CreateProduct } from './dto/createProduct.dto';

class ProductResponse {
    name: string;
}

@Controller('product')
@ApiTags('Product')
export class ProductController implements OnModuleInit{
    constructor(
        @Inject('PRODUCT') private readonly productClient: ClientKafka,
    ) { }
    onModuleInit() {
        ['product_create', 'all_products'].forEach(action => this.productClient.subscribeToResponseOf(action));
    }

    private async sendRequest(pattern: string, data: any): Promise<Observable<any>> {
        return this.productClient
            .send(pattern, data)
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        throw new RequestTimeoutException();
                    }
                    throw new HttpException(err.message, err.status);
                })
            );
    }

    @Post("create")
    @UseGuards(AuthGuard)
    @ApiBody({ type: CreateProduct })
    @ApiBearerAuth()
    private async createProduct(@Request() req: Request, @Body() data: CreateProduct): Promise<Observable<ProductResponse>> {
        return this.sendRequest("product_create", data);
    }

    @Get('all')
    private async allProduct(): Promise<Observable<any>> {
        return this.sendRequest("all_products", {});
    }
}
