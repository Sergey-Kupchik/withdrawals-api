import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

class TagDto {
  title: string;
  price: number;
}

@Schema()
export class CatToy {
  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  price: number;
}
export const CatToySchema = SchemaFactory.createForClass(CatToy);

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  @Prop({ default: [], type: [CatToySchema] })
  tags: { title: string; price: number }[];

  addTags(tagDto: TagDto) {
    if (tagDto.price <= 0) {
      throw new Error('Bad price. Prise should be greater than zero');
    }
    this.tags.push({ title: tagDto.title, price: tagDto.price });
  }

  setAge(age: number) {
    if (age <= this.age) {
      throw new Error('Bad age. Cat can not get yanger');
    }
    this.age = age;
  }
  static createSuperCat(
    dto: { name: string; age: number; breed: string },
    Model: CatModelType,
  ): CatDocument {
    if (dto.age <= 0) {
      throw new Error('Bad age. AGE SHOULD BE GREATER THAN zero');
    }
    return new Model(dto);
  }
}
export const CatSchema = SchemaFactory.createForClass(Cat);

type CatModelStaticType = {
  createSuperCat: (
    dto: { name: string; age: number; breed: string },
    CatModel: CatModelType,
  ) => CatDocument;
};

CatSchema.methods = {
  addTags: Cat.prototype.addTags,
  setAge: Cat.prototype.setAge,
};

CatSchema.statics = {
  createSuperCat: Cat.createSuperCat,
} as CatModelStaticType;

export type CatDocument = HydratedDocument<Cat>;
export type CatModelType = Model<CatDocument> & CatModelStaticType;
