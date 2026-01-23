import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environments';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';

import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/products.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  orderForm!: FormGroup;

  cartItems: { product: Product, quantity: number }[] = [];

  totalAmount = 0;

  private cartSubscription!: Subscription;

  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: [],
    status: 'pending'
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });

  }

  // =============================
  // INIT
  // =============================

  ngOnInit(): void {

    this.orderData.user_id = this.tokenService.getUserId();

    // REALTIME CART SUBSCRIBE
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {

      const productIds = Array.from(cart.keys());

      if (productIds.length === 0) {
        this.cartItems = [];
        this.totalAmount = 0;
        return;
      }

      this.productService.getProductsByIds(productIds).subscribe({

        next: products => {

          this.cartItems = productIds.map(productId => {

            const product = products.find(p => p.id === productId)!;

            product.thumbnail =
              `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;

            return {
              product,
              quantity: cart.get(productId)!
            };

          });

          this.calculateTotal();

        },

        error: err => {
          console.error('Load cart products error', err);
        }

      });

    });

  }

  // =============================
  // PLACE ORDER
  // =============================

  placeOrder(): void {

    if (!this.orderForm.valid) {
      alert('Vui lòng kiểm tra thông tin đặt hàng');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Giỏ hàng đang trống');
      return;
    }

    const orderPayload: OrderDTO = {
      ...this.orderData,
      ...this.orderForm.value,
      user_id: this.tokenService.getUserId(),
      total_money: this.totalAmount,
      cart_items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      status: 'pending'
    };

    this.orderService.placeOrder(orderPayload).subscribe({

      next: (response: Order) => {

        alert('Đặt hàng thành công');

        this.cartService.clearCart();

        // this.router.navigate(['/order-success', response.id]);
        this.router.navigate(['/']);

      },

      error: err => {
        console.error(err);
        alert('Đặt hàng thất bại');
      }

    });

  }

  // =============================
  // CALCULATE TOTAL
  // =============================

  calculateTotal(): void {

    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  }

  // =============================
  // CLEANUP
  // =============================

  ngOnDestroy(): void {

    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }

  }
increaseQuantity(productId: number) {
  const item = this.cartItems.find(i => i.product.id === productId);
  if (!item) return;

  this.cartService.updateQuantity(productId, item.quantity + 1);
}

decreaseQuantity(productId: number) {
  const item = this.cartItems.find(i => i.product.id === productId);
  if (!item) return;

  this.cartService.updateQuantity(productId, item.quantity - 1);
}

removeItem(productId: number) {
  if (!confirm('Xóa sản phẩm khỏi giỏ hàng?')) return;

  this.cartService.removeFromCart(productId);
}

}
