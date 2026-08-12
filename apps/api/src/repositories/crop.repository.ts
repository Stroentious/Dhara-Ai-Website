import { prisma } from '../config/prisma';
import { Crop } from '@prisma/client';

const INITIAL_CROPS = [
  {
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereals',
    description: 'Major staple cereal crop.',
  },
  {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereals',
    description: 'Staple food grain requiring high water.',
  },
  {
    name: 'Maize',
    scientificName: 'Zea mays',
    category: 'Cereals',
    description: 'Corn / maize grain crop.',
  },
  {
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Tuber',
    description: 'Tuber crop.',
  },
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    description: 'Horticultural vegetable crop.',
  },
  {
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Fiber',
    description: 'Fiber cash crop.',
  },
  {
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crop',
    description: 'High biomass water intensive crop.',
  },
  {
    name: 'Mustard',
    scientificName: 'Brassica juncea',
    category: 'Oilseeds',
    description: 'Rabi oilseed crop.',
  },
  {
    name: 'Vegetables',
    scientificName: 'Various',
    category: 'Vegetables',
    description: 'General seasonal vegetables.',
  },
  {
    name: 'Other',
    scientificName: 'N/A',
    category: 'General',
    description: 'Other agricultural crop type.',
  },
];

export class CropRepository {
  private inMemoryCrops: Map<string, Crop> = new Map();

  constructor() {
    this.seedDefaultCrops();
  }

  private async seedDefaultCrops() {
    const now = new Date();
    for (const c of INITIAL_CROPS) {
      const mockCrop: Crop = {
        id: `crp_${c.name.toLowerCase()}`,
        name: c.name,
        scientificName: c.scientificName,
        category: c.category,
        description: c.description,
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryCrops.set(mockCrop.id, mockCrop);

      try {
        await prisma.crop.upsert({
          where: { name: c.name },
          update: {},
          create: c,
        });
      } catch {
        // Fallback initialized
      }
    }
  }

  async findAll(): Promise<Crop[]> {
    try {
      const crops = await prisma.crop.findMany({
        orderBy: { name: 'asc' },
      });
      if (crops.length > 0) return crops;
    } catch {
      // Fallback below
    }
    return Array.from(this.inMemoryCrops.values());
  }

  async findById(id: string): Promise<Crop | null> {
    try {
      return await prisma.crop.findUnique({
        where: { id },
      });
    } catch {
      return this.inMemoryCrops.get(id) || null;
    }
  }
}

export const cropRepository = new CropRepository();
