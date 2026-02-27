import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserResponse } from '../../responses/user/user.response';
import { Product } from '../../models/product';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/products.service';
import { environment } from '../../../environments/environments';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  totalCartItems = 0;
  isLoggedIn = false;

  miniCartItems: {
    product: Product;
    quantity: number;
  }[] = [];
  private cartSubscription!: Subscription;
  constructor(
    private userService: UserService,
    private popoverConfig: NgbPopoverConfig,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
  ) {}
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();

    this.isLoggedIn = !!this.tokenService.getToken();

    // CHƯA LOGIN => KHÔNG SUBSCRIBE CART
    if (!this.isLoggedIn) {
      this.totalCartItems = 0;
      this.miniCartItems = [];
      return;
    }

    // LOGIN => REALTIME CART
    this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
      // BADGE COUNT
      this.totalCartItems = Array.from(cart.values()).reduce(
        (total, qty) => total + qty,
        0,
      );

      const productIds = Array.from(cart.keys());

      if (productIds.length === 0) {
        this.miniCartItems = [];
        return;
      }

      this.productService.getProductsByIds(productIds).subscribe({
        next: (products) => {
          this.miniCartItems = productIds.map((id) => {
            const product = products.find((p) => p.id === id)!;

            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;

            return {
              product,
              quantity: cart.get(id)!,
            };
          });
        },
      });
    });
    this.userResponse = this.userService.getUserResponseFromLocalStorage();

if (this.userResponse) {
  this.cartService.setUserCart(this.userResponse.id);
} else {
  this.cartService.setUserCart();
}

  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();


this.cartService.setUserCart(); // chuyển về guest cart

      this.userResponse = null;
      this.totalCartItems = 0;
      this.miniCartItems = [];

      this.router.navigate(['/login']);
    }

    this.isPopoverOpen = false;
  }
}
