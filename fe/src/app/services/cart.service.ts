import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Map<number, number> = new Map();

  private cartSubject = new BehaviorSubject<Map<number, number>>(new Map());

  cart$ = this.cartSubject.asObservable();

  private currentCartKey = 'cart_guest';

  constructor() {}

  // SET CART KEY WHEN LOGIN / LOGOUT
  setUserCart(userId?: number) {

    if (userId) {
      this.currentCartKey = `cart_user_${userId}`;
    } else {
      this.currentCartKey = 'cart_guest';
    }

    this.loadCart();
  }

  private loadCart() {

    const storedCart = localStorage.getItem(this.currentCartKey);

    this.cart = storedCart
      ? new Map(JSON.parse(storedCart))
      : new Map();

    this.cartSubject.next(new Map(this.cart));

  }

  addToCart(productId: number, quantity: number = 1) {

    if (this.cart.has(productId)) {
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      this.cart.set(productId, quantity);
    }

    this.updateState();
  }

  updateQuantity(productId: number, quantity: number) {

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cart.set(productId, quantity);
    this.updateState();
  }

  removeFromCart(productId: number) {

    this.cart.delete(productId);
    this.updateState();
  }

  clearCart() {

    this.cart.clear();

    localStorage.removeItem(this.currentCartKey);

    this.cartSubject.next(new Map());
  }

  private updateState() {

    localStorage.setItem(
      this.currentCartKey,
      JSON.stringify(Array.from(this.cart.entries()))
    );

    this.cartSubject.next(new Map(this.cart));
  }

}
