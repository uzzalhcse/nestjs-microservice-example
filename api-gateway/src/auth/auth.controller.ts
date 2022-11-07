import { Body, Catch, Controller, HttpException, Inject, OnModuleInit, Post, Req, RequestTimeoutException, UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { AuthGuard } from './auth.gurd';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { RegisterRequest, RegisterResponse } from './dto/resgister.dto';
import { ExceptionFilter } from './rpc-exception.filter';

@Controller('auth')
@ApiTags('User')
export class AuthController {

    constructor(
        @Inject('USER') private readonly userClient: ClientProxy,
        private readonly authService: AuthService
    ) { }





    @Post('register')
    @ApiBody({ type: RegisterRequest })
    private async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
        return this.userClient
            .send("register", body)
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        throw new RequestTimeoutException()
                    }
                    throw new HttpException({message:[err.message]}, err.status)
                }))
    }


    @Post('login')
    @ApiBody({ type: LoginRequest })
    private async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
        return this.userClient.send("login", body)
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        throw new RequestTimeoutException()
                    }
                    throw new HttpException({message:[err.message]}, err.status)
                }))
    }



    @Post('verify')
    @UseGuards(AuthGuard)
    private async validate(@Req() req: any): Promise<any> {
        return {success:true,user:req.user}
    }



}
