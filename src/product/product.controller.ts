import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductSearchDto } from './dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getProducts() {
    return this.productService.getProducts();
  }
  @Get('categories')
  getCategories() {
    return this.productService.getCategories();
  }
  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  getProductsSearch(@Query() productSearchDto: ProductSearchDto) {
    console.log(productSearchDto);
    return this.productService.getProductsSearch(productSearchDto);
  }
}
