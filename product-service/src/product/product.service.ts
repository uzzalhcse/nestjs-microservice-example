import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(data) {
        try {
            return await this.prisma.product.create({
                data:{
                    name:data?.name,
                    description:data?.description,
                    price:data?.price,
                    stock:data?.stock
                }
            })
            
        } catch (error) {
            
            throw new RpcException({message:"Server error",status:HttpStatus.INTERNAL_SERVER_ERROR})
        }
       
    }

    async getAllProducts() {
        let products =  await this.prisma.product.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        return {products}
    }

    async getSingleProduct(id) {
     
        return await this.prisma.product.findUnique({
            where:{
                id
            }
        })

    }


    async decreaseStock({productId,quantity}){
        let product = await this.getSingleProduct(productId)
        if (!product) {
            
            return { error: ['Product not found'], status: HttpStatus.NOT_FOUND };
          } else if (product.stock <= 0) {
            return { error: ['Stock too low'], status: HttpStatus.CONFLICT };
          }
      
          await this.prisma.product.update({
                where:{id:productId},
                data:{stock:{decrement:quantity}}
          })

          return { id: product.id, error: null, status: HttpStatus.OK };
    }


    async getProductByIds({ids}){
 
        
        return await this.prisma.product.findMany({
            where:{
                id:{
                    in:ids
                }
            }
        })
    }
}
