import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { v2 as cloudinary } from "cloudinary";

import { prisma } from "../server/utils/prisma";
import { env } from "../server/utils/env";

type ParsedProduct = {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: string;
  material: string;
  finish: string;
  size?: string;
  folderPath: string;
  imagePaths: string[];
};

const PRODUCT_ROOT = process.env.PRODUCT_ROOT
  ? path.resolve(process.env.PRODUCT_ROOT)
  : path.resolve(process.cwd(), "..", "Product desc and imgs");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const priceByFolder: Record<string, number> = {
  "carved geometric circle wood": 4500,
  "decoration bike design": 6500,
  "decoration item": 8500,
  islamic: 9500,
  "living room decor": 9000,
  "round wall art": 4200,
  "rounf wall living room decor": 4800,
  "set of 8 wall frames": 14500,
  "stylish table lamp": 5500,
  "wooden wall mounted shelf": 3800,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function firstMeaningfulLine(text: string): string {
  return (
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && !/^name:?$/i.test(line) && !/^product details/i.test(line)) || ""
  );
}

function compactDescription(text: string): string {
  return text
    .replace(/Name:\s*/i, "")
    .replace(/Product details of\s*/i, "")
    .replace(/[✅🌟🖼️🪵🕌🎨📐🏡🔧🎁✨•●]/g, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1, 12)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 1200);
}

function inferCategory(folderName: string): string {
  const value = folderName.toLowerCase();
  if (value.includes("lamp")) return "Lighting";
  if (value.includes("shelf")) return "Shelves";
  if (value.includes("islamic") || value.includes("frame")) return "Islamic Wall Art";
  if (value.includes("bike")) return "Neon Decor";
  return "Wall Decor";
}

function inferMaterial(text: string): string {
  if (/mdf/i.test(text)) return "MDF";
  if (/walnut/i.test(text)) return "Walnut";
  if (/oak/i.test(text)) return "Oak";
  return "Engineered Wood";
}

function inferSize(text: string): string | undefined {
  const match = text.match(/(?:size\s*[:\n]\s*)?(\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?(?:\s*(?:inches|cm))?)/i);
  return match?.[1].replace(/\s+/g, " ");
}

async function readProducts(): Promise<ParsedProduct[]> {
  const folders = await fs.readdir(PRODUCT_ROOT, { withFileTypes: true });
  const products: ParsedProduct[] = [];

  for (const folder of folders.filter((item) => item.isDirectory())) {
    const folderPath = path.join(PRODUCT_ROOT, folder.name);
    const descPath = path.join(folderPath, "Desc.txt");
    const rawDescription = await fs.readFile(descPath, "utf8");
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    const imagePaths = files
      .filter((file) => file.isFile() && IMAGE_EXTENSIONS.has(path.extname(file.name).toLowerCase()))
      .map((file) => path.join(folderPath, file.name));

    const title = firstMeaningfulLine(rawDescription) || folder.name;
    const key = folder.name.toLowerCase();

    products.push({
      name: title.slice(0, 180),
      slug: slugify(folder.name),
      description: compactDescription(rawDescription),
      basePrice: priceByFolder[key] || 5000,
      category: inferCategory(folder.name),
      material: inferMaterial(rawDescription),
      finish: "Matte",
      size: inferSize(rawDescription),
      folderPath,
      imagePaths,
    });
  }

  return products;
}

async function uploadImages(product: ParsedProduct) {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const uploaded = [];
  for (const imagePath of product.imagePaths) {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: `luxury-cnc/products/${product.slug}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: "image",
    });

    uploaded.push({
      imageUrl: result.secure_url,
      altText: product.name,
    });
  }

  return uploaded;
}

async function main() {
  const products = await readProducts();

  for (const product of products) {
    const images = await uploadImages(product);

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice,
        category: product.category,
        material: product.material,
        finish: product.finish,
        metadata: {
          size: product.size,
          importedFrom: path.relative(process.cwd(), product.folderPath),
          priceNeedsReview: true,
        },
        images: {
          create: images,
        },
      },
      update: {
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        category: product.category,
        material: product.material,
        finish: product.finish,
        metadata: {
          size: product.size,
          importedFrom: path.relative(process.cwd(), product.folderPath),
          priceNeedsReview: true,
        },
        images: {
          deleteMany: {},
          create: images,
        },
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Imported ${product.name} with ${images.length} images.`);
  }

  await prisma.$disconnect();
}

void main().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
