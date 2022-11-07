import { Controller, Get, UseFilters } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ExceptionFilter } from './rpc-exception.filter';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getHello(): string {
        return this.userService.getHello();
    }



    @MessagePattern("register")
    register(@Payload() data: any, @Ctx() context: RmqContext) {
      
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.userService.registerUser(data)
    }



    @MessagePattern("login")
    login(@Payload() data: any, @Ctx() context: RmqContext) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.userService.login(data)
    }


    @MessagePattern("validate")
    validate(@Payload() data: any, @Ctx() context: RmqContext) {
      
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage()

        channel.ack(originalMsg);
        return this.userService.validate(data)
    }


}
