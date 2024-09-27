import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../../models/product';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [MatButtonModule, MatListModule, MatIconModule, CurrencyPipe, MatCard],
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css',
})
export class CartViewComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice = 0;

  private cartService: CartService = inject(CartService);

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.totalPrice = this.getTotalPrice();
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.totalPrice = 0;
    });
  }

  checkout(): void {
    this.cartService.checkout(this.cartItems).subscribe(() => {
      this.cartItems = [];
      this.totalPrice = 0;
      //   add a toast notification here
    });
  }
}
