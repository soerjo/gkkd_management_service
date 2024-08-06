import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class UploadDto {
  @ApiProperty({
    description: 'File',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e8)
  @HasMimeType(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
  file: MemoryStoredFile;
}
