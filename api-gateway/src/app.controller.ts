import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  // @Post("register")
  // register(@Body() body:any){
  //   this.appService.registerUer(body)
  // }

  // @Get("message")
  // getMessage(){
  //   return this.appService.getMessage()
  // }
}
