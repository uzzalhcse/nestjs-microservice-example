import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateOrder{

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    productId:Number

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @ApiProperty()
    quantity:Number
}