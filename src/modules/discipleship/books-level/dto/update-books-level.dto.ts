import { PartialType } from '@nestjs/swagger';
import { CreateBooksLevelDto } from './create-books-level.dto';

export class UpdateBooksLevelDto extends PartialType(CreateBooksLevelDto) {}
