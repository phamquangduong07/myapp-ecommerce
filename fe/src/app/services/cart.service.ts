import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Map<number, number> = new Map();
  private cartSubject = new BehaviorSubject<Map<number, number>>(new Map());
  cart$ = this.cartSubject.asObservable();

  private currentCartKey = 'cart_guest';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

 setUserCart(userId?: number): void {
  this.cart.clear();
  this.cartSubject.next(new Map());

  this.currentCartKey = userId
    ? `cart_user_${userId}`
    : 'cart_guest';

  this.loadCart();
}


  private loadCart(): void {
    if (!this.isBrowser) {

      this.cart = new Map();
      this.cartSubject.next(new Map());
      return;
    }

    const storedCart = localStorage.getItem(this.currentCartKey);

    this.cart = storedCart
      ? new Map(JSON.parse(storedCart))
      : new Map();

    this.cartSubject.next(new Map(this.cart));
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (!this.isBrowser) return;

    this.cart.set(
      productId,
      (this.cart.get(productId) ?? 0) + quantity
    );

    this.updateState();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (!this.isBrowser) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cart.set(productId, quantity);
    this.updateState();
  }

  removeFromCart(productId: number): void {
    if (!this.isBrowser) return;

    this.cart.delete(productId);
    this.updateState();
  }

  clearCart(): void {
    if (!this.isBrowser) return;

    this.cart.clear();
    localStorage.removeItem(this.currentCartKey);
    this.cartSubject.next(new Map());
  }

  private updateState(): void {
    if (!this.isBrowser) return;

    localStorage.setItem(
      this.currentCartKey,
      JSON.stringify(Array.from(this.cart.entries()))
    );

    this.cartSubject.next(new Map(this.cart));
  }
}
