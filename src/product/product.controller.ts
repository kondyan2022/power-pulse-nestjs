import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductSearchDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, HasProfileGuard } from 'src/user/guards';
import { CurrentUser } from 'src/user/decorator';
import { UserDocument } from 'src/user/schemas';
import { IProductSearch } from './types';

@ApiBearerAuth('token')
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @ApiOperation({ description: 'Get a full list of products' })
  @Get()
  @UseGuards(AuthGuard, HasProfileGuard)
  getProducts() {
    return this.productService.getProducts();
  }

  @ApiOperation({ description: 'Get a list of product categories ' })
  @Get('categories')
  @UseGuards(AuthGuard)
  getCategories() {
    return this.productService.getCategories();
  }

  @ApiOperation({
    description: 'Get a list of products with filtering and pagination options',
  })
  @Get('search')
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getProductsSearch(
    @CurrentUser() user: UserDocument,
    @Query() productSearchDto: ProductSearchDto,
  ): Promise<IProductSearch> {
    return this.productService.getProductsSearch(user, productSearchDto);
  }
}
