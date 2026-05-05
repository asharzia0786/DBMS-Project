import type { Prisma } from "@prisma/client";

import { ProductRepository } from "../repositories/product.repository";
import { AppError } from "../utils/app-error";
import type {
  CreateProductInput,
  ProductListQuery,
  UpdateProductInput,
} from "../validators/product.validator";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async listProducts(params: ProductListQuery) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await this.productRepository.findAll({
      skip,
      take: params.pageSize,
      search: params.search,
      category: params.category,
      material: params.material,
      finish: params.finish,
    });

    return {
      items,
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize) || 1,
    };
  }

  public async getBySlug(slug: string) {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError("Product not found.", "PRODUCT_NOT_FOUND", 404);
    }
    return product;
  }

  public async createProduct(input: CreateProductInput) {
    const existing = await this.productRepository.findBySlug(input.slug);
    if (existing) {
      throw new AppError("Product slug already exists.", "SLUG_CONFLICT", 409);
    }

    return this.productRepository.create({
      name: input.name,
      slug: input.slug,
      description: input.description,
      basePrice: input.basePrice,
      category: input.category,
      material: input.material,
      finish: input.finish,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      images: input.images,
    });
  }

  public async updateProduct(id: string, input: UpdateProductInput) {
    const data: Prisma.ProductUpdateInput = {};

    if (input.slug) {
      const existing = await this.productRepository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new AppError("Product slug already exists.", "SLUG_CONFLICT", 409);
      }
      data.slug = input.slug;
    }

    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.basePrice !== undefined) data.basePrice = input.basePrice;
    if (input.category !== undefined) data.category = input.category;
    if (input.material !== undefined) data.material = input.material;
    if (input.finish !== undefined) data.finish = input.finish;
    if (input.metadata !== undefined) {
      data.metadata = input.metadata as Prisma.InputJsonValue;
    }

    const product = await this.productRepository.update(id, data);

    if (input.images) {
      return this.productRepository.replaceImages(id, input.images);
    }

    return product;
  }

  public async deleteProduct(id: string) {
    await this.productRepository.delete(id);
    return { id };
  }
}
