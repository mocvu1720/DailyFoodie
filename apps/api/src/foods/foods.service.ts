import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({
      data: createFoodDto,
    });
  }

  async findAll(options?: {
    filter?: { name?: string; description?: string };
    skip?: number;
    take?: number;
    orderBy?: {
      field: 'id' | 'name' | 'createdAt' | 'updatedAt';
      direction?: 'asc' | 'desc';
    };
  }) {
    const { filter, skip, take, orderBy } = options || {};
    return this.prisma.food.findMany({
      where: {
        ...(filter?.name && { name: { contains: filter.name } }),
        ...(filter?.description && {
          description: { contains: filter.description },
        }),
      },
      skip,
      take,
      orderBy: orderBy
        ? { [orderBy.field]: orderBy.direction || 'asc' }
        : undefined,
    });
  }

  async findOne(id: number) {
    // Tăng view và monthlyView mỗi lần xem
    await this.prisma.food.update({
      where: { id },
      data: {
        view: { increment: 1 },
        monthlyView: { increment: 1 },
      },
    });
    return this.prisma.food.findUnique({
      where: { id },
    });
  }

  async getViewStats() {
    const total = await this.prisma.food.aggregate({
      _sum: { view: true, monthlyView: true },
    });
    return {
      totalView: total._sum.view || 0,
      totalMonthlyView: total._sum.monthlyView || 0,
    };
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  async remove(id: number) {
    // Delete related steps
    await this.prisma.step.deleteMany({ where: { foodId: id } });
    // Delete related ingredients
    await this.prisma.ingredient.deleteMany({ where: { foodId: id } });
    // Delete the food
    return this.prisma.food.delete({
      where: { id },
    });
  }

  /**
   * Lấy ngẫu nhiên số lượng món ăn cho mỗi category
   * @param categoryCounts object dạng { [categoryId]: số lượng }
   * @returns object dạng { [categoryId]: Food[] }
   */
  async randomFoodsByCategory(categoryCounts: Record<number, number>) {
    const result: Record<number, any[]> = {};
    for (const [categoryIdStr, count] of Object.entries(categoryCounts)) {
      const categoryId = Number(categoryIdStr);
      if (!count || isNaN(categoryId)) {
        result[categoryId] = [];
        continue;
      }
      // Lấy tất cả id món ăn thuộc category
      const foods = await this.prisma.food.findMany({
        where: { categoryId },
        select: { id: true },
      });
      if (foods.length === 0) {
        result[categoryId] = [];
        continue;
      }
      // Lấy ngẫu nhiên count id
      const shuffled = foods.map((f) => f.id).sort(() => Math.random() - 0.5);
      const randomIds = shuffled.slice(0, Math.min(count, foods.length));
      // Lấy chi tiết các món ăn này
      result[categoryId] = await this.prisma.food.findMany({
        where: { id: { in: randomIds } },
      });
    }
    return result;
  }
}
