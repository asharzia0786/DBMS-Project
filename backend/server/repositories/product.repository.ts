import type { Prisma, Product } from "@prisma/client";

import { prisma } from "../utils/prisma";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

export class ProductRepository {
  public findAll(params: {
    skip: number;
    take: number;
    search?: string;
    category?: string;
    material?: string;
    finish?: string;
  }): Promise<[ProductWithImages[], number]> {
    const where: Prisma.ProductWhereInput = {
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(params.category ? { category: params.category } : {}),
      ...(params.material ? { material: params.material } : {}),
      ...(params.finish ? { finish: params.finish } : {}),
    };

    return prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: params.skip,
        take: params.take,
        include: { images: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);
  }

  public findBySlug(slug: string): Promise<ProductWithImages | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });
  }

  public create(data: {
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    stock: number;
    category?: string;
    material?: string;
    finish?: string;
    metadata?: Prisma.InputJsonValue;
    images: Array<{ imageUrl: string; altText?: string }>;
  }): Promise<ProductWithImages> {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        stock: data.stock,
        category: data.category,
        material: data.material,
        finish: data.finish,
        metadata: data.metadata,
        images: {
          create: data.images.map((image) => ({
            imageUrl: image.imageUrl,
            altText: image.altText,
          })),
        },
      },
      include: { images: true },
    });
  }

  public update(
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductWithImages> {
    return prisma.product.update({
      where: { id },
      data,
      include: { images: true },
    });
  }

  public replaceImages(
    id: string,
    images: Array<{ imageUrl: string; altText?: string }>,
  ): Promise<ProductWithImages> {
    return prisma.product.update({
      where: { id },
      data: {
        images: {
          deleteMany: {},
          create: images.map((image) => ({
            imageUrl: image.imageUrl,
            altText: image.altText,
          })),
        },
      },
      include: { images: true },
    });
  }

  public delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }
}
