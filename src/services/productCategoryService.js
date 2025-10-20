import { ProductCategoryModel } from "../models/productCategory.js";

 

export const ProductCategoryService = {
  
  async createCategory(data) {
    const { name, shopId } = data;
    if (!shopId) {
      throw new Error("L'ID de la boutique est requis");
    }
    const existing = await ProductCategoryModel.findByName(name);
    if (existing && existing.shopId === shopId) {
      throw new Error("Cette catégorie existe déjà pour cette boutique");
    }

    return ProductCategoryModel.create({
      name,
      shopId,
    });
  },

 
  async updateCategory(id, data) {
    const category = await ProductCategoryModel.findById(id);
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    return ProductCategoryModel.update(id, data);
  },
 
  async deleteCategory(id) {
    const category = await ProductCategoryModel.findById(id);
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    return ProductCategoryModel.delete(id);
  },
 
  async getCategoriesByShop(shopId) {
    if (!shopId) {
      throw new Error("L'ID de la boutique est requis");
    }

    return ProductCategoryModel.findAllByShop(shopId);
  },
};
