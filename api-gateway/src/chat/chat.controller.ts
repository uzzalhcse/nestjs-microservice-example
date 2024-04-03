import { Body, Controller, Get, HttpException, Inject, Post, Req, RequestTimeoutException, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.gurd';
import { CreateProduct } from './dto/createProduct.dto';


class ProductResponse {
    name: String
}

@Controller('product')
@ApiTags('Product')
export class ProductController {
    constructor(
        @Inject('PRODUCT') private readonly productClient: ClientProxy,
        //private readonly authService: AuthService
    ) { }

    @Post("create")
    @UseGuards(AuthGuard)
    @ApiBody({type:CreateProduct})
    @ApiBearerAuth()
    private async createProduct(@Req() req: Request, @Body() data: CreateProduct): Promise<Observable<ProductResponse>> {
        return this.productClient
            .send("product_create", data)
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                         throw new RequestTimeoutException()
                    }
                throw new HttpException(err.message, err.status)
            }))



    }

    @Get('all')
    private async allProduct(): Promise<Observable<any>> {
        return this.productClient
            .send("all_products", {})
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                         throw new RequestTimeoutException()
                    }
                throw new HttpException(err.message, err.status)
            }))

    }
}
