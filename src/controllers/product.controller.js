const { ProductFactory, Product } = require("../services/product.service");
const { Created } = require("../core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    new Created({
      message: "Create product success",
      metaData: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //query

  getAllDraftsForShop = async (req, res, next) => {
    new Created({
      message: "Get all drafts for shop success",
      metaData: await Product.findAllDrafForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublicShop = async (req, res, next) => {
    new Created({
      message: "Get all getAllPublicShop for shop success",
      metaData: await Product.findAllPublicForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new Created({
      message: "Publish product by shop success",
      metaData: await Product.publicProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new Created({
      message: "Unpublish product by shop success",
      metaData: await Product.unPublicProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new Created({
      message: "Search products success",
      metaData: await Product.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
