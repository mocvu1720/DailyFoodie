import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStepDto: CreateStepDto) {
    return this.prisma.step.create({
      data: createStepDto,
    });
  }

  async findAll(foodId: number) {
    return this.prisma.step.findMany({
      where: { foodId },
    });
  }

  async findOne(id: number) {
    return this.prisma.step.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    return this.prisma.step.update({
      where: { id },
      data: updateStepDto,
    });
  }

  async remove(id: number) {
    return this.prisma.step.delete({
      where: { id },
    });
  }
}
