import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/all');
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + "/" + id);
  }

  saveProduct(product: Product): Observable<Product> {
    const { pnumber, ...productRemainder } = product;
    return this.http.post<Product>(this.apiUrl + '/add', productRemainder).pipe(
      catchError((error: any) => {
        console.error('Error occurred while saving to DB: ' + error);
        return throwError(error);
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.patch<Product>(this.apiUrl + "/update/" + id, product).pipe(
      catchError((error: any) => {
        console.log('Error while making PATCH request for ' + id + ":", error);
        return throwError(error);
      })
    );
  }
  
}
