import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER') private readonly userClient: ClientProxy,
  ) { }


  getHello() {
    return this.userClient.send({cmd:"connect_test"},{});
  }
}
