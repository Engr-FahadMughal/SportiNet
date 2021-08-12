import { IOrderToCreate } from './../shared/models/order';
import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  createOrder(order: IOrderToCreate) {
    return this.httpClient.post(this.baseUrl + 'orders/CreateOrder', order);
  }

  getDeliveryMethods() {
    return this.httpClient.get(this.baseUrl + 'orders/GetDeliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price)
      })
    );
  }
}
