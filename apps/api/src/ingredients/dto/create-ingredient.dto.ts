import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Thịt bò', description: 'Tên nguyên liệu' })
  name: string;

  @ApiProperty({ example: '200', required: false, description: 'Số lượng' })
  amount?: string;

  @ApiProperty({ example: 'gram', required: false, description: 'Đơn vị' })
  unit?: string;

  @ApiProperty({ example: 1, description: 'ID món ăn liên kết' })
  foodId: number;
}
