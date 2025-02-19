import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Post(':id/assets')
  createWalletAsset(@Param('id') id: string, @Body() createWalletAssetDto: Omit<CreateWalletAssetDto, 'walletId'>) {
    return this.walletsService.createWalletAsset({
      assetId: createWalletAssetDto.assetId,
      walletId: id,
      shares: createWalletAssetDto.shares
    });
  }
}
