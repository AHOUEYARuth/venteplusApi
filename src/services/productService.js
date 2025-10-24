import { ProductModel } from "../models/products.model.js";


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
