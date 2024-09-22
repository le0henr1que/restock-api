import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class Media implements Media {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'The unique identifier for the media',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    example: 'www.google.com.br',
    description: 'The Media Url',
  })
  @AutoMap()
  url: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Time when the media was created',
  })
  @AutoMap()
  createdDate: Date;
}
