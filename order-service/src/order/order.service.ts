import { HttpStatus, Inject, Injectable, Logger, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrderService {
    @Inject('PRODUCT')
    private readonly productClient: ClientProxy
    constructor(private prisma: PrismaService) { }

    async createOrder(body): Promise<any> {


        try {
            const product = await this.productClient.send("single_product", { productId: body.productId })
                .pipe(
                    timeout(5000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException()
                        }
                        return throwError(err);
                    }))
                .toPromise();

            if (!product) {
                throw new RpcException({ status: HttpStatus.NOT_FOUND, message: "Product not found" });

            }


            if (product?.stock < body.quantity) {
                throw new RpcException({ status: HttpStatus.NOT_ACCEPTABLE, message: "Quantity must be below stock" });
            }



            let decreasedStockData = await this.productClient
                .send("decrease_stock", { productId: body.productId, quantity: body.quantity })
                .pipe(
                    timeout(10000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException();
                        }
                        return throwError(err);
                    }))
                .toPromise();


            const order = await this.prisma.order.create({
                data: {
                    quantity: body.quantity,
                    productId: body.productId,
                    userId: body.userId,
                    price: product?.price,
                },
            })


            if (decreasedStockData.status === HttpStatus.CONFLICT) {
                // deleting order if decreaseStock fails
                await this.prisma.order.delete({
                    where: { id: order?.id }
                })

                return { id: null, error: decreasedStockData.error, status: HttpStatus.CONFLICT };
            }

            return order

        } catch (e) {
            Logger.log(e);
            throw e;
        }


    }

    uniqueBy(arr, prop) {
        return arr.reduce((a, d) => {
            if (!a.includes(d[prop])) { a.push(d[prop]); }
            return a;
        }, []);
    }

    async getProductsByIds(productIds){
        try {
            let products = await this.productClient.send("products_by_ids", { ids: productIds })
            .pipe(
                timeout(3000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        throw new RequestTimeoutException()
                    }
                    return throwError(err);
                })
                )
            .toPromise();
            return products
        } catch (error) {
            return []
        }
      
    }


    async myOrders({ userId }): Promise<any> {
        let orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy:{
                createdAt:"desc"
            }
        })

        let productIds = this.uniqueBy(orders, "productId")


        
        let products =  await this.getProductsByIds(productIds)
      
        let formated = orders.map(x => ({
            ...x,
            product: products?.find(product => x.productId === product.id) || null
        }))

        return {orders:formated}
    }
}
