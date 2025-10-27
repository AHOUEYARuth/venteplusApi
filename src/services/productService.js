import { ProductModel } from "../models/products.model.js";
import prisma from "../prismaClient.js";


export const ProductService = {
  
  async createProduct(data) {
    const { name, categoryId, shopId , image} = data;

    if (!categoryId || !shopId) {
      throw new Error("Le categoryId et le shopId sont requis");
    }

    const existing = await ProductModel.findByName(name);
    if (existing && existing.shopId === shopId) {
      throw new Error("Un produit avec ce nom existe déjà dans cette boutique");
    }

    return ProductModel.create(data);
  },


 async getTopSellingProducts(shopId) {
    if (!shopId) throw new Error("shopId est requis");

    
    const topProducts = await prisma.toOrder.groupBy({
      by: ["productId"],
      where: {
        order: {
          shopId,
          isSale: true,
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    if (topProducts.length === 0) return [];

    const productIds = topProducts.map((p) => p.productId);

   
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
        shop: true,
      },
    });
 
    const result = products.map((product) => {
      const stats = topProducts.find((tp) => tp.productId === product.id);
      return {
        ...product,
        totalSold: stats?._sum?.quantity ?? 0,
      };
    });

     
    result.sort((a, b) => b.totalSold - a.totalSold);

    return result;
  },
  
  async updateProduct(id, data) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Produit non trouvé");
    }

    return ProductModel.update(id, data);
  },

 
  async deleteProduct(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Produit non trouvé");
    }

    return ProductModel.delete(id);
  },


  async getProductsByShop(shopId, filters = {}) {
    if (!shopId) {
      throw new Error("L'ID de la boutique est requis");
    }
    console.log("filters");
    console.log(filters)
    
    return ProductModel.findByShop(shopId, filters);
  },
 
  async getProductsByCategory(categoryId) {
    if (!categoryId) {
      throw new Error("L'ID de la catégorie est requis");
    }

    return ProductModel.findByCategory(categoryId);
  },

  
  async getLowStockProducts(shopId) {
    const products = await ProductModel.findByShop(shopId);
    return products.filter(
      (p) => p.availableQuantity <= p.minimumQuantity
    );
  },
};
