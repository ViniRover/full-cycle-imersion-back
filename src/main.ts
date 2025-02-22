import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AssetsService } from './assets/assets.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const assetService = app.get(AssetsService);
  // assetService.subscribeEvents().subscribe((event) => {
  //   console.log(event)
  // })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
