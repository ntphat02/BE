const { product } = require("../../models/product.model");
const { Types } = require("mongoose");
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublicForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProducts = async ({ keySearch }) => {
  const result = await product
    .find(
      {
        $text: { $search: keySearch },
        isDraft: false,
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } });
  return result;
}; // sắp xếp theo độ liên quan

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isPublished = true;
  foundShop.isDraft = false;

  return await foundShop.save();
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isPublished = false;
  foundShop.isDraft = true;

  return await foundShop.save();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .limit(limit)
    .skip(skip)
    .lean();
};
module.exports = {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublicForShop,
  unPublicProductByShop,
  searchProducts,
};
