import { HttpException, Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { ValidateResponse } from './dto/validateResponse.dto';


@Injectable()
export class AuthService {
  @Inject('USER')
  private readonly userClient: ClientProxy




  async validate(token: string):Promise<any>{
    
    return this.userClient
    .send("validate", { token })
      .pipe(
        timeout(10000),
        catchError(err => {
          throw new HttpException(err.message, err.status)
        })).toPromise()


  }
}