import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  product: Product | null = null;
  showErrorMessage: boolean = false;
  showDevelopersNameExceedError: boolean = false;
  errorFetchingProduct: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId != null) {
      const storedProduct = localStorage.getItem(`product_${productId}`);
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
        if (this.product) {
          this.initializeForm(this.product);
        }
      } else {
        this.productService.getProductById(productId).subscribe((data: Product) => {
          this.product = data;
          this.initializeForm(data);
          localStorage.setItem(`product_${productId}`, JSON.stringify(data));
        });
      }
    } else {
      this.errorFetchingProduct = true;
    }
  }

  initializeForm(product: Product) {
    this.productForm = this.formBuilder.group({
      productName: [product?.pname, [Validators.required]],
      scrumMaster: [product?.scrumMaster, [Validators.required]],
      productOwner: [product?.powner, [Validators.required]],
      developerNames: [product?.pdevelopers, [Validators.required]],
      startDate: [{ value: product?.startDate, disabled: true }],
      methodology: [product?.pmethodology, [Validators.required]],
      githubLink: [product?.githubLink, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.productForm.valid && this.product && this.checkDevelopersFormat()) {
      const updatedProductData: Product = {
        pnumber: this.product.pnumber,
        pname: this.productForm.get('productName')?.value,
        scrumMaster: this.productForm.get('scrumMaster')?.value,
        powner: this.productForm.get('productOwner')?.value,
        pdevelopers: this.productForm.get('developerNames')?.value,
        startDate: this.product.startDate,
        pmethodology: this.productForm.get('methodology')?.value,
        githubLink: this.productForm.get('githubLink')?.value,
      };

      this.product = updatedProductData;
      localStorage.setItem(`product_${this.product.pnumber}`, JSON.stringify(updatedProductData));

      this.productService.updateProduct(this.product.pnumber, updatedProductData).subscribe(
        (response: Product) => {
          this.showErrorMessage = false;
          this.router.navigate(['/']);
        },
        (error: any) => {
          this.showErrorMessage = true;
        }
      );
    }
  }

  checkDevelopersFormat(): boolean {
    const data: string = this.productForm.get('developerNames')?.value;
    if (data && data.split(',').length <= 5) {
      this.showDevelopersNameExceedError = false;
      return true;
    } else {
      this.showDevelopersNameExceedError = true;
      return false;
    }
  }

  cancelAction() {
    this.router.navigate(['/']);
  }
}
