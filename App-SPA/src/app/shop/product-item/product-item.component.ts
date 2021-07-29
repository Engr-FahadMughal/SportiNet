import { IProduct } from './../../shared/models/product';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input()  product!: IProduct; // ! definite assignment assertion: telling the typescript that value is not null or undefined.
  // @Input()  product?: IProduct; // value is undefined.

  constructor() { }

  ngOnInit(): void {
  }

}
