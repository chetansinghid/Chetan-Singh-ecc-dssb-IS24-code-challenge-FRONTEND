import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup = new FormGroup({});
  showErrorMessage: boolean = false;
  showDevelopersNameExceedError: boolean = false;

  constructor(private formBuilder: FormBuilder, private service: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required]],
      scrumMaster: ['', [Validators.required]],
      productOwner: ['', [Validators.required]],
      developerNames: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      methodology: ['Agile', [Validators.required]],
    });
  }

  get formControls() {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.productForm.valid && this.checkDevelopersFormat()) {
      const newProduct: Product = {
        pnumber: -1,
        pname: this.productForm.get('productName')?.value,
        scrumMaster: this.productForm.get('scrumMaster')?.value,
        powner: this.productForm.get('productOwner')?.value,
        pdevelopers: this.productForm.get('developerNames')?.value,
        startDate: this.productForm.get('startDate')?.value,
        pmethodology: this.productForm.get('methodology')?.value,
        githubLink: ''
      };
      this.service.saveProduct(newProduct).subscribe((data:Product) => {
        this.router.navigate(['/']);
      },
      (error: any) => {
        this.toggleErrorMessage();
      });

    } else {
      this.productForm.markAllAsTouched();
    }
  }

  cancelAction() {
    this.router.navigate(['/']);
  }

  toggleErrorMessage() {
    this.showErrorMessage = true;
  }

  toggleDeveloperNameWarning() {
    this.showDevelopersNameExceedError = true;
  }

  checkDevelopersFormat(): boolean {
    const data : string = this.productForm.get('developerNames')?.value;
    if((data.split(',')).length <= 5) {
      return true;
    } else {
      this.toggleDeveloperNameWarning();
      return false;
    }
  }
}
