import { IsString, MaxLength } from 'class-validator';
import { IsMongoIdObject } from '../../validation/is-mongoId-object';

export class CreatePostDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  // @IsMongoIdObject({ message: 'blogId is not MongoId' })
  @IsString()
  blogId: string;

  //remove then I do headers in http
  @IsString()
  userId: string;
}
