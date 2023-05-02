import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { LikeStatusRepoEnum } from 'src/likes/interfaces/like.interface';

export function IsLikeStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsLikeStatus',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value in LikeStatusRepoEnum;
        },
      },
    });
  };
}
