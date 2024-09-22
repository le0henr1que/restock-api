import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiResponseProperty({
    example: 'Status Code ( 500, 401, 400... )',
  })
  statusCode: number;

  @ApiResponseProperty({
    example: 'Horário da exceção',
  })
  timestamp: string;

  @ApiResponseProperty({
    example: 'Rota',
  })
  path: string;

  @ApiResponseProperty({
    example: '["Mensagem de erro 1", "Mensagem de erro 2"]',
    type: [String],
  })
  messages: string[];
}

export class BadRequestResponse extends ErrorResponse {}

export class ConflictResponse extends ErrorResponse {}

export class NotFoundResponse extends ErrorResponse {}

export class InternalServerErrorResponse extends ErrorResponse {}
