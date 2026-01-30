// This file is for seed data - optional for development
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Crear store por defecto
  const store = await prisma.store.create({
    data: {
      name: 'eCommerce Store',
      description: 'Tu tienda online profesional',
    },
  });

  console.log('✅ Store creado:', store.id);
  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
