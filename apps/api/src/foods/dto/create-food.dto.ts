import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty({ example: 'Phở bò', description: 'Tên món ăn' })
  name: string;

  @ApiProperty({ example: 'Món ăn truyền thống Việt Nam', required: false })
  description?: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/pho.jpg',
    description: 'URL hình ảnh',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'Luộc xương, trụng bánh phở, thêm thịt bò...',
    description: 'Cách làm',
  })
  receipt: string;
}
