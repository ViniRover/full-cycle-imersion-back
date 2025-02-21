import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Wallet } from './entities/wallet.entity';
import mongoose, { Model } from 'mongoose';
import { WalletAsset } from './entities/wallet-asset.entity';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) 
    private walletSchema: Model<Wallet>,
    @InjectModel(WalletAsset.name) 
    private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() 
    private connection: mongoose.Connection,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    return this.walletSchema.create(createWalletDto);
  }

  findAll() {
    return this.walletSchema.find().populate([
      {
        path: 'assets',
        populate: ['asset']
      }
    ]);
  }

  findOne(id: string) {
    return this.walletSchema.findById(id).populate([
      {
        path: 'assets', 
        populate: ['asset'],
      },
    ]) as Promise<
      (Wallet & { assets: (WalletAsset & { asset: Asset })[] }) | null
    >;
  }

  async createWalletAsset(createWalletAssetDto: CreateWalletAssetDto) {
    const session = await this.connection.startSession();
    await session.startTransaction();

    try {
      const docs = await this.walletAssetSchema.create(
        [
          {
            wallet: createWalletAssetDto.walletId,
            asset: createWalletAssetDto.assetId,
            shares: createWalletAssetDto.shares,
          }
        ], 
        { session }
      );
  
      const walletAsset = docs[0];
      await this.walletSchema.updateOne(
        { _id: createWalletAssetDto.walletId }, 
        { $push: { assets: walletAsset._id }},
        { session }
      );
  
      await session.commitTransaction();
      return walletAsset;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
