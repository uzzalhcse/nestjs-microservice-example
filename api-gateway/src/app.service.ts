import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  // constructor(
  //   @Inject('USER') private readonly userClient: ClientProxy,
  //   @Inject('PRODUCT') private readonly productClient: ClientProxy,
  // ) { }

  getHello(): string {
    return 'Hello World!!!';
  }


  registerUer(body: any) {
    // this.userClient.emit(
    //   "user_register",
    //   body
    // )
  }


  getMessage(){
    //return this.userClient.send({cmd:"get_message"},{name:"shimul"})
  }
}
