import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subjects = await prisma.subject.findMany({
    select: { name: true }
  });
  
  console.log("المواد الموجودة في قاعدة البيانات هي:");
  console.log(subjects);
}

main().finally(async () => await prisma.$disconnect());