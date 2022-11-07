import { Injectable, CanActivate, ExecutionContext, HttpStatus, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { ValidateResponse } from './dto/validateResponse.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const req: any = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];


    

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');


 
    

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }


    

    const token: string = bearer[1];

    const response = await this.service.validate(token);
   
    
     let {status,user} = response
     req.user = user

     

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return true;
  }
}