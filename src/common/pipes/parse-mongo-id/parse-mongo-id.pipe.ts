import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

//Custom pipe para validar un id de mongo
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata });
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} no es un MongoID`);
    }

    return value;
  }
}
