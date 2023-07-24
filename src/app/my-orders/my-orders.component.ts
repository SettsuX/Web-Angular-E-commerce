import { Component, OnInit } from '@angular/core';
import { MyOrderDetails } from '../_model/order.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  displayedColumns = ["Name", "Address", "Contact No.", "Alternate Contact", "Value", "Amount", "Status", "Actions"];

  myOrderDetails: MyOrderDetails[] = [];

  status: string = 'All';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getOrderDetails(this.status);
  }

  getOrderDetails(statusParameter: string) {
    this.productService.getMyOrders(statusParameter).subscribe(
      (resp: MyOrderDetails[]) => {
        console.log(resp);
        this.myOrderDetails = resp;
      }, (err)=> {
        console.log(err);
      }
    );
  }
  
  markAsCancelledByUser(orderId) {
    console.log(orderId);
    this.productService.markAsCancelledByUser(orderId).subscribe(
      (response) => {
        this.getOrderDetails(this.status);
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }

  markAsSuccessful(orderId) {
    console.log(orderId);
    this.productService.markAsSuccessful(orderId).subscribe(
      (response) => {
        this.getOrderDetails(this.status);
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }

}
