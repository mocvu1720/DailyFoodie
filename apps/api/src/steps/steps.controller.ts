import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('steps')
@ApiTags('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('MODERATOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiBody({ type: CreateStepDto })
  create(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Get()
  findAll(@Query('foodId') foodId: string) {
    const id = Number(foodId);
    if (!id)
      throw new BadRequestException('foodId is required and must be a number');
    return this.stepsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stepsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('MODERATOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateStepDto })
  update(@Param('id') id: string, @Body() updateStepDto: UpdateStepDto) {
    return this.stepsService.update(+id, updateStepDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('MODERATOR', 'ADMIN')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.stepsService.remove(+id);
  }
}
