import { IPagination } from './models/pagination';
import { IProduct } from './models/product';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SportiHub';
  products: IProduct[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get('https://localhost:5001/api/products/getproducts').subscribe(
      (response: any) => {
      this.products = response.data;
    }, error => {
      console.log(error);
    });
  }
}
