import { Body, Catch, Controller, HttpException, Inject, OnModuleInit, Post, Req, RequestTimeoutException, UseFilters, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { ExceptionFilter } from './rpc-exception.filter';
import {RegisterRequest, RegisterResponse} from "./dto/resgister.dto";
import {AuthGuard} from "./auth.gurd";

@Controller('auth')
@ApiTags('User')
export class AuthController implements OnModuleInit {

    constructor(
        @Inject('USER') private readonly userClient: ClientKafka,
        private readonly authService: AuthService
    ) { }

    onModuleInit() {
        ['login', 'register', 'validate'].forEach(action => this.userClient.subscribeToResponseOf(action));
    }

    @Post('register')
    @ApiBody({ type: RegisterRequest })
    private async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
        return this.invokeUserClient('register', body);
    }

    @Post('login')
    @ApiBody({ type: LoginRequest })
    private async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
        return this.invokeUserClient('login', body);
    }

    private async invokeUserClient(action: string, data: any): Promise<Observable<any>> {
        return this.userClient
            .send(action, data)
            .pipe(
                timeout(5000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        throw new RequestTimeoutException();
                    }
                    throw new HttpException({ message: [err.message] }, err.status);
                }));
    }

    @Post('verify')
    @UseGuards(AuthGuard)
    private async validate(@Req() req: any): Promise<any> {
        return { success: true, user: req.user };
    }
}
