import {
  Controller,
  Get,
  HttpStatus,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('health')
@ApiTags('Health Check')
export class HealthCheckController {
  @ApiOperation({ summary: 'Check Server Health' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Server is running',
  })
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @UseGuards(ThrottlerGuard)
  @Get()
  async health(@Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      status: 'Running',
    });
  }
}
