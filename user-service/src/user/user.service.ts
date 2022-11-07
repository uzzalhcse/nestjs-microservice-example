import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, userDocument } from 'src/user/schemas/user.schema';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly User: Model<userDocument>) { }
    @Inject(JwtService)
    private readonly jwtService: JwtService;


    getHello(): string {
        return 'Hello World!';
    }


    async registerUser(body) {
        let data = {
            name: body?.name,
            email: body?.email,
            password: this.jwtService.encodePassword(body?.password)
        }


        try {
            let find = await this.User.findOne({ email: data.email }).exec()
            if (find) {
                throw new RpcException({status: HttpStatus.NOT_ACCEPTABLE,message:"User already exists"});
            }
            let _user = new this.User(data)
            let user = await _user.save()
            return user
        } catch (error) {

            throw error
        }

    }

    async login(body) {
        try {
            let {email, password} = body
            let user = await this.User.findOne({email}).exec()


            

            if(!user){
                throw  new RpcException({status: HttpStatus.NOT_FOUND,message:"User not found"});
            }

            const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, user.password);

            if (!isPasswordValid) {
                throw new RpcException({status: HttpStatus.NOT_ACCEPTABLE,message:"Password wrong"});
            }

            const token: string = this.jwtService.generateToken(user);

            return { token, status: HttpStatus.OK, error: null };

        } catch (error) {
       
            throw error
        }
    }


    async validate({token}){
    
      
    
        const decoded = await this.jwtService.verify(token);
        if (!decoded) {
            throw new RpcException({status:HttpStatus.FORBIDDEN,message:"Token is invalid"});
           
          }
      
          const auth = await this.jwtService.validateUser(decoded);
    
          if (!auth) {
            throw new RpcException({status:HttpStatus.FORBIDDEN,message:"User not found"});
          }
      
          
      
          return { status: HttpStatus.OK, error: null, user:decoded };
    }
}
