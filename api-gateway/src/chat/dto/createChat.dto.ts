import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @ApiProperty()
  senderId: string;

  @IsNotEmpty()
  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  content: string;
}
