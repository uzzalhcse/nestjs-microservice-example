import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService:ProductService){}


    @MessagePattern("product_create")
    createProduct(@Payload() data: any, @Ctx() context: RmqContext){

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.productService.createProduct(data)
    }


    
    @MessagePattern("all_products")
    allProducts( @Ctx() context: RmqContext) {

      
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.productService.getAllProducts()
    }


    @MessagePattern("single_product")
    getSingleProduct(@Payload() data: any, @Ctx() context: RmqContext){
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.productService.getSingleProduct(data.productId)
    }
    @MessagePattern("decrease_stock")
    decreaseStock(@Payload() data: any, @Ctx() context: RmqContext){
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.productService.decreaseStock(data)
    }


    @MessagePattern("products_by_ids")
    getProductByIds(@Payload() data: any, @Ctx() context: RmqContext){
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.productService.getProductByIds(data)
    }
}
