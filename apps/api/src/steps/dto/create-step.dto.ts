import { ApiProperty } from '@nestjs/swagger';

export class CreateStepDto {
  @ApiProperty({ example: 1, description: 'Thứ tự bước' })
  order: number;

  @ApiProperty({
    example: 'Luộc xương trong 2 tiếng',
    description: 'Nội dung bước',
  })
  content: string;

  @ApiProperty({ example: 1, description: 'ID món ăn liên kết' })
  foodId: number;
}
