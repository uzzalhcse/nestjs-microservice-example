import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterRequest {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty()
  password: string;
}

export class RegisterResponse {
  status: number;
  error: string[];
}