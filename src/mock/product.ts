/**
 * Mock Product Data
 */

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

export const productsMock: Product[] = [
  {
    id: 'prod_001',
    code: 'SEK-CWL-200',
    name: 'Sekkisei Clear Wellness Lotion',
    brand: 'Sekkisei',
    category: 'Skincare',
    price: 1200,
    image_url: '/products/sekkisei-lotion.jpg',
    is_active: true,
  },
  {
    id: 'prod_002',
    code: 'SEK-CWE-200',
    name: 'Sekkisei Clear Wellness Emulsion',
    brand: 'Sekkisei',
    category: 'Skincare',
    price: 1300,
    image_url: '/products/sekkisei-emulsion.jpg',
    is_active: true,
  },
  {
    id: 'prod_003',
    code: 'SEK-CWW-200',
    name: 'Sekkisei Clear Wellness Wash',
    brand: 'Sekkisei',
    category: 'Skincare',
    price: 850,
    image_url: '/products/sekkisei-wash.jpg',
    is_active: true,
  },
  {
    id: 'prod_004',
    code: 'DEC-AQMC-30',
    name: 'Decorte AQ Meliority Cream',
    brand: 'Decorte',
    category: 'Skincare',
    price: 2500,
    image_url: '/products/decorte-cream.jpg',
    is_active: true,
  },
  {
    id: 'prod_005',
    code: 'DEC-AQMS-40',
    name: 'Decorte AQ Meliority Serum',
    brand: 'Decorte',
    category: 'Skincare',
    price: 2800,
    image_url: '/products/decorte-serum.jpg',
    is_active: true,
  },
  {
    id: 'prod_006',
    code: 'INF-PML-200',
    name: 'Infinity Pure Moisture Lotion',
    brand: 'Infinity',
    category: 'Skincare',
    price: 1500,
    image_url: '/products/infinity-lotion.jpg',
    is_active: true,
  },
  {
    id: 'prod_007',
    code: 'INF-PME-200',
    name: 'Infinity Pure Moisture Emulsion',
    brand: 'Infinity',
    category: 'Skincare',
    price: 1600,
    image_url: '/products/infinity-emulsion.jpg',
    is_active: true,
  },
  {
    id: 'prod_008',
    code: 'ESP-PRC-30',
    name: 'Esprique Precious Rich Cream',
    brand: 'Esprique',
    category: 'Skincare',
    price: 1800,
    image_url: '/products/esprique-cream.jpg',
    is_active: true,
  },
  {
    id: 'prod_009',
    code: 'OBK-CTM-30',
    name: 'One by Kose Clear Turn Mask',
    brand: 'One by Kose',
    category: 'Skincare',
    price: 450,
    image_url: '/products/onebykose-mask.jpg',
    is_active: true,
  },
  {
    id: 'prod_010',
    code: 'SEK-WPW-100',
    name: 'Sekkisei White Powder Wash',
    brand: 'Sekkisei',
    category: 'Skincare',
    price: 950,
    image_url: '/products/sekkisei-powder-wash.jpg',
    is_active: true,
  },
];

export const productMock = {
  findById(id: string): Product | null {
    return productsMock.find((p) => p.id === id) || null;
  },

  findByCode(code: string): Product | null {
    return productsMock.find((p) => p.code === code) || null;
  },

  getAll(): Product[] {
    return productsMock.filter((p) => p.is_active);
  },

  search(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return productsMock.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.code.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  },
};

