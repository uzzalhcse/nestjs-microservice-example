import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';


import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, userDocument } from '../schemas/user.schema';

@Injectable()
export class JwtService {


    @InjectModel(User.name) private readonly User: Model<userDocument>
    private readonly jwt: Jwt;

    constructor(jwt: Jwt) {
        this.jwt = jwt;
    }

    // Decoding the JWT Token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null);
    }

    // Get User by User ID we get from decode()
    public async validateUser(decoded): Promise<any> {
      
        return await this.User.findOne({_id:decoded._id}).exec();
    }

    // Generate JWT Token
    public generateToken(auth): string {
        return this.jwt.sign({ _id: auth._id, email: auth.email ,name:auth?.name});
    }

    // Validate User's password
    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword);
    }

    // Encode User's password
    public encodePassword(password: string): string {
      
        const salt: string = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    }

    // Validate JWT Token, throw forbidden error if JWT Token is invalid
    public async verify(token: string): Promise<any> {
        try {
            return this.jwt.verify(token);
        } catch (err) { }
    }
}