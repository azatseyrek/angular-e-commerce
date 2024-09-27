import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe, FlexModule, MatInputModule, MatSelectModule, NgForOf],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  // Service injection
  private productService: ProductService = inject(ProductService);
  private cartService: CartService = inject(CartService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);

  // Component properties
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = '';

  sortOptions = [
    { value: 'priceLowHigh', viewValue: 'Price: Low to High' },
    { value: 'priceHighLow', viewValue: 'Price: High to Low' },
  ];

  // Component initialization
  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  // Component methods
  addToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this._snackbar.open('Product added to cart', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },

      error: (error) => {
        this._snackbar.open('Error adding product to cart', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(filterValue));

    if (this.sortOrder) {
      this.sortProducts(this.sortOrder);
    }
  }

  sortProducts(sortValue: string): void {
    this.sortOrder = sortValue;
    if (this.sortOrder === this.sortOptions[0].value) {
      this.filteredProducts = this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === this.sortOptions[1].value) {
      this.filteredProducts = this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }
}
