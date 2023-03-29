import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument, CatModelType } from '../schemas/cat.schema';
import { CatsRepository, CreateCatDto } from './cats.repository';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: CatModelType,
    private readonly catsRepository: CatsRepository,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const { tags, ...rest } = createCatDto;
    const createdCat = this.catModel.createSuperCat(rest, this.catModel);
    createdCat.addTags(tags);
    return this.catsRepository.save(createdCat);
  }

  async updateAge(id: string, age: number): Promise<Cat> {
    const currenCat = await this.catModel.findById(id).exec();
    if (!currenCat) throw new Error('Wrong cat id');
    currenCat.setAge(age);
    return this.catsRepository.save(currenCat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
