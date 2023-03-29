import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from '../schemas/cat.schema';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async save(cat: CatDocument): Promise<Cat> {
    return cat.save();
  }
}

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
  tags: { title: string; price: number };
}
