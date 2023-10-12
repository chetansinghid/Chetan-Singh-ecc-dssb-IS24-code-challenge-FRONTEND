import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      console.log(data);
      this.products = data;
    });
  }

  modifyActionHandler(pNumber: number) {
    this.router.navigate(["/edit-product/" + pNumber]);
  }

  getDeveloperNames(names: string) : string {
    return names.substring(1,names.length-1);
  }
  
  addProduct() {
    this.router.navigate(['/add-product']);
  }
}
