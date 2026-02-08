const { clothing, product, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublicForShop,
  unPublicProductByShop,
  searchProducts,
} = require("../models/repository/product.repo");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Cloting(payload).createProduct();
      case "Electronics":
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, product_id });
  }

  //query
  static async findAllDrafForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublicForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublicForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch });
  }

  //put
  static async publicProductByShop({ product_shop, product_id }) {
    return await publicProductByShop({ product_shop, product_id });
  }

  static async unPublicProductByShop({ product_shop, product_id }) {
    return await unPublicProductByShop({ product_shop, product_id });
  }
}

class Cloting extends Product {
  async createProduct() {
    const newCloting = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newCloting) throw new BadRequestError("Create clothing product error");

    const newProduct = await super.createProduct(newCloting._id);
    if (!newProduct) throw new BadRequestError("Create product error");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics)
      throw new BadRequestError("Create electronic product error");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Create product error");

    return newProduct;
  }
}

module.exports = { ProductFactory, Product };
