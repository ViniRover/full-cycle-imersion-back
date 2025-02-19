import { Asset } from "./entities/asset.entity";

export class AssetPresenter {
  constructor(private asset: Asset) {}

  toJSON() {
    return {
      _id: this.asset._id,
      name: this.asset.name,
      price: this.asset.price,
      symbol: this.asset.symbol,
      createdAt: this.asset.createdAt,
      updatedAt: this.asset.updatedAt,
      imageUrl: `http://localhost:9000/${this.asset.image}`
    }
  }
}