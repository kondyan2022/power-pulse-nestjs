import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('categories')
  getCategories() {
    return this.productService.getCategories();
  }

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }
}
