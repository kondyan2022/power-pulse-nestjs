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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard, HasProfileGuard } from 'src/user/guards';
import { CurrentUser } from 'src/user/decorator';
import { UserDocument } from 'src/user/schemas';
import { IProductSearch } from './types';
import { ErrorResponse } from 'src/types';
import { Product } from './schemas';
import { ProductResponse, ProductSearchResponse } from './dto/responses';
import { CategoryResponse } from './dto/responses';

@ApiBearerAuth('token')
@ApiTags('products')
@Controller('products')
@ApiUnauthorizedResponse({ description: 'Not authorized', type: ErrorResponse })
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @ApiOperation({ description: 'Get a full list of products' })
  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: ProductResponse,
    isArray: true,
  })
  @UseGuards(AuthGuard, HasProfileGuard)
  getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @ApiOperation({ description: 'Get a list of product categories ' })
  @Get('categories')
  @ApiOkResponse({
    description: 'Successful response',
    type: CategoryResponse,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  getCategories() {
    return this.productService.getCategories();
  }

  @ApiOperation({
    summary: 'Get a list of products with filtering and pagination options',
    description: 'Get a list of products with filtering and pagination options',
  })
  @Get('search')
  @ApiOkResponse({ description: '', type: ProductSearchResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: ErrorResponse })
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
