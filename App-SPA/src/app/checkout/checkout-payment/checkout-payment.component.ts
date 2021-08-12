import { NavigationExtras } from '@angular/router';
import { IOrder } from './../../shared/models/order';
import { FormGroup } from '@angular/forms';
import { IBasket } from './../../shared/models/basket';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from './../../basket/basket.service';
import { CheckoutService } from './../checkout.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {

  @Input() checkoutForm: FormGroup;

  constructor(private checkoutService: CheckoutService, private basketService: BasketService, 
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully');
      this.basketService.deleteLocalBasket(basket.id);
      console.log(order);// it has to be remove
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethod: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
