import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('foods')
@ApiTags('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới một món ăn' })
  @ApiResponse({ status: 201, description: 'Tạo món ăn thành công.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  @ApiBody({ type: CreateFoodDto })
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả món ăn' })
  @ApiResponse({ status: 200, description: 'Danh sách món ăn.' })
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một món ăn theo id' })
  @ApiResponse({ status: 200, description: 'Chi tiết món ăn.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn.' })
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin món ăn' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn.' })
  @ApiBody({ type: UpdateFoodDto })
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa một món ăn' })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn.' })
  remove(@Param('id') id: string) {
    return this.foodsService.remove(+id);
  }
}
