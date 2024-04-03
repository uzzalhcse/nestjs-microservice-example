import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, isNotEmpty, IsNumber, Min } from "class-validator";

export class CreateProduct {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @ApiProperty()
    description:string;

    @IsInt()
    @Min(1)
    @ApiProperty()
    price:number

    @IsNotEmpty()
    @Min(1)
    @ApiProperty()
    stock:number
}