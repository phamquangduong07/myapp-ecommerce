import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/products.service';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environments';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    debugger;

    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger;
          this.product = response;
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        },
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }
  showImage(index: number): void {
    if (!this.product?.product_images?.length) return;

    const total = this.product.product_images.length;

    if (index < 0) {
      this.currentImageIndex = total - 1; // quay về ảnh cuối
    } else if (index >= total) {
      this.currentImageIndex = 0; // quay về ảnh đầu
    } else {
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger;
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }
    addToCart(productId: number, event: Event): void {
    event.stopPropagation(); // ngăn click card redirect
    if (!this.tokenService.getToken()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });

      return;
    }
    this.cartService.addToCart(productId, 1);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
   this.router.navigate(['/orders']);
  }
}
