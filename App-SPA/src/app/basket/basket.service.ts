import { IProduct } from './../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { Basket, IBasket, IBasketItem, IBasketTotals } from './../shared/models/basket';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
//@ts-ignore
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  //@ts-ignore
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  getBasket(id: string) {
    return this.httpClient.get<IBasket>(this.baseUrl + 'basket/GetBasketById?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        })
      );
  }

  setBasket(basket:IBasket) {
    return this.httpClient.post<IBasket>(this.baseUrl + 'basket/UpdateBasket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;  
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
     let basketValue = this.getCurrentBasketValue(); //?? this.createBasket();
     if (basketValue === null) {
      const basket = this.createBasket();
      basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
      this.setBasket(basket);
     }
       basketValue.items  = this.addOrUpdateItem(basketValue.items, itemToAdd, quantity);
       this.setBasket(basketValue);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }
    else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      }
      else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    this.httpClient.delete(this.baseUrl + 'basket/DeleteBasket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null); //to set interface null: one option is to turn stric: false in tsconfig.json
      this.basketTotalSource.next(null); // need to address
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    })
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number) : IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(productItem: IProduct, quantity: number) : IBasketItem {
    return {
      id: productItem.id,
      productName: productItem.name,
      price: productItem.price,
      pictureUrl: productItem.pictureUrl,
      quantity,
      brand: productItem.productBrand,
      type: productItem.productType
    };
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((n, i) => (i.price * i.quantity) + n, 0); // n is the return number of accamulated function of reduce() & i is the item in the array & 0 is the initialized value of n.
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }
}
