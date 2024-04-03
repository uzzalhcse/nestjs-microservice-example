import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject, OnModuleInit,
  Post,
  Req,
  RequestTimeoutException,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.gurd';
import { CreateChatDto } from './dto/createChat.dto';

class ChatResponse {
  name: string;
}

@Controller('chat')
@ApiTags('chat')
export class ChatController implements OnModuleInit{
  constructor(@Inject('CHAT') private readonly chatClient: ClientKafka) {}

  onModuleInit() {
    ['chat_create', 'my_chats'].forEach(action => this.chatClient.subscribeToResponseOf(action));
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateChatDto })
  @ApiBearerAuth()
  private async createChat(
    @Req() req: Request,
    @Body() data: CreateChatDto,
  ): Promise<Observable<ChatResponse>> {
    return this.chatClient.send('chat_create', data).pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        throw new HttpException(err.message, err.status);
      }),
    );
  }

  @Get('my-chats')
  private async myChats(): Promise<Observable<any>> {
    return this.chatClient.send('my_chats', {}).pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        throw new HttpException(err.message, err.status);
      }),
    );
  }
}
