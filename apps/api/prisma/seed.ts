import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Tạo categories
  await prisma.category.createMany({
    data: [
      { name: 'Món chính' },
      { name: 'Món phụ' },
      { name: 'Tráng miệng' },
      { name: 'Ăn vặt' },
      { name: 'Đồ uống' },
    ],
  });

  // Tạo tags
  await prisma.tag.createMany({
    data: [
      { name: 'Việt Nam' },
      { name: 'Chay' },
      { name: 'Ăn sáng' },
      { name: 'Ăn tối' },
      { name: 'Healthy' },
      { name: 'Nhanh' },
      { name: 'Gia đình' },
    ],
  });

  // Lấy lại categories và tags để lấy id
  const allCategories = await prisma.category.findMany();
  const allTags = await prisma.tag.findMany();

  // Tạo foods
  const foods = [
    {
      name: 'Phở bò',
      description: 'Món ăn truyền thống Việt Nam',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/pho.jpg',
      receipt: 'Luộc xương, trụng bánh phở, thêm thịt bò...',
      category: 'Món chính',
      tags: ['Việt Nam', 'Ăn sáng'],
      ingredients: [
        { name: 'Thịt bò', amount: '200', unit: 'gram' },
        { name: 'Bánh phở', amount: '300', unit: 'gram' },
      ],
      steps: [
        { order: 1, content: 'Luộc xương trong 2 tiếng' },
        { order: 2, content: 'Trụng bánh phở, thêm thịt bò' },
      ],
    },
    {
      name: 'Bánh mì chay',
      description: 'Bánh mì Việt Nam phiên bản chay',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/banhmi.jpg',
      receipt: 'Nướng bánh, thêm rau củ và pate chay...',
      category: 'Ăn vặt',
      tags: ['Việt Nam', 'Chay', 'Healthy'],
      ingredients: [
        { name: 'Bánh mì', amount: '1', unit: 'ổ' },
        { name: 'Rau củ', amount: '100', unit: 'gram' },
      ],
      steps: [
        { order: 1, content: 'Nướng bánh mì' },
        { order: 2, content: 'Thêm rau củ và pate chay' },
      ],
    },
    {
      name: 'Chè đậu xanh',
      description: 'Món tráng miệng ngọt mát',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/che.jpg',
      receipt: 'Nấu đậu xanh với đường, thêm nước cốt dừa...',
      category: 'Tráng miệng',
      tags: ['Việt Nam', 'Ăn tối'],
      ingredients: [
        { name: 'Đậu xanh', amount: '100', unit: 'gram' },
        { name: 'Đường', amount: '50', unit: 'gram' },
      ],
      steps: [
        { order: 1, content: 'Nấu đậu xanh với nước' },
        { order: 2, content: 'Thêm đường và nước cốt dừa' },
      ],
    },
    {
      name: 'Sinh tố bơ',
      description: 'Đồ uống bổ dưỡng',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sinhto.jpg',
      receipt: 'Xay bơ với sữa đặc và đá...',
      category: 'Đồ uống',
      tags: ['Healthy', 'Nhanh'],
      ingredients: [
        { name: 'Bơ', amount: '1', unit: 'quả' },
        { name: 'Sữa đặc', amount: '40', unit: 'ml' },
      ],
      steps: [{ order: 1, content: 'Xay bơ với sữa đặc và đá' }],
    },
    {
      name: 'Cơm tấm',
      description: 'Món ăn đặc trưng Sài Gòn',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/comtam.jpg',
      receipt: 'Nấu cơm tấm, nướng sườn, làm mỡ hành...',
      category: 'Món chính',
      tags: ['Việt Nam', 'Gia đình'],
      ingredients: [
        { name: 'Gạo tấm', amount: '200', unit: 'gram' },
        { name: 'Sườn heo', amount: '150', unit: 'gram' },
      ],
      steps: [
        { order: 1, content: 'Nấu cơm tấm' },
        { order: 2, content: 'Nướng sườn' },
        { order: 3, content: 'Làm mỡ hành' },
      ],
    },
  ];

  for (const food of foods) {
    const category = allCategories.find((c) => c.name === food.category);
    const tagIds = allTags
      .filter((t) => food.tags.includes(t.name))
      .map((t) => ({ id: t.id }));
    await prisma.food.create({
      data: {
        name: food.name,
        description: food.description,
        imageUrl: food.imageUrl,
        receipt: food.receipt,
        categoryId: category?.id,
        tags: { connect: tagIds },
        ingredients: { create: food.ingredients },
        steps: { create: food.steps },
      },
    });
  }

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
