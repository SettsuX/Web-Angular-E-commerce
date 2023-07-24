import { ChangeDetectorRef, Component, Injector, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import * as Razorpay from 'razorpay';
import { OrderDetails } from '../_model/order-details.model';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { FileHandle } from '../_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

//declare var Razorpay: any;

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  isSingleProductCheckout: string = '';
  productDetails: Product[] = [] ;

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    //transactionId: '',
    orderProductQuantityList: [],
  }

  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private injector: Injector) { }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");
    
    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        {productId: x.productId, quantity: 1}
      )
    );

    console.log(this.productDetails)
    console.log(this.orderDetails);
  }

  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();

        const ngZone = this.injector.get(NgZone);
        ngZone.run(
          () => {
            this.router.navigate(["/orderConfirm"]);
          }
        );

      },
      (err) => {
        console.log(err);
      }
    );
  }


  getQuantityForProduct(productId) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId, productDiscountedPrice) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity * productDiscountedPrice;
  }

  onQuantityChanged(q, productId) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = q;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;

    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productDiscountedPrice;
        grandTotal = grandTotal + price * productQuantity.quantity;
      }
    );

    return grandTotal;
  }

  // prepareFormDataForProduct(orderDetails: OrderDetails): FormData {
  //   const uploadImageData = new FormData();
  //   uploadImageData.append(
  //     "order",
  //     new Blob([JSON.stringify(orderDetails)], { type: "application/json" })
  //   );

  //   for (var i = 0; i < this.orderDetails.orderImages.length; i++) {
  //     uploadImageData.append(
  //       "imageFile",
  //       this.orderDetails.orderImages[i].file,
  //       this.orderDetails.orderImages[i].file.name
  //     );
  //   }
  //   return uploadImageData;
  // }

  // onFileSelected(event: any) {
  //   if (event.target.files) {
  //     const file = event.target.files[0];
  //     const fileHandle: FileHandle = {
  //       file: file,
  //       url: this.sanitizer.bypassSecurityTrustUrl(
  //         window.URL.createObjectURL(file)
  //       ),
  //     };
  //     this.orderDetails.orderImages.push(fileHandle);
  //   }
  // }

  // removeImages(i: number) {
  //   this.orderDetails.orderImages.splice(i, 1);
  // }

  // fileDropped(fileHandle: FileHandle) {
  //   this.orderDetails.orderImages.push(fileHandle);
  // }

  // createTransactionAndPlaceOrder(orderForm: NgForm) {
  //   let amount = this.getCalculatedGrandTotal();
  //   this.productService.createTransaction(amount).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.openTransactioModal(response, orderForm);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );

  // }

  // openTransactioModal(response: any, orderForm: NgForm) {
  //   var options = {
  //     order_id: response.orderId,
  //     key: response.key,
  //     amount: response.amount,
  //     currency: response.currency,
  //     name: 'Learn programming yourself',
  //     description: 'Payment of online shopping',
  //     image: 'https://cdn.pixabay.com/photo/2023/01/22/13/46/swans-7736415_640.jpg',
  //     handler: (response: any) => {
  //       if(response!= null && response.razorpay_payment_id != null) {
  //         this.processResponse(response, orderForm);
  //       } else {
  //         alert("Payment failed..")
  //       }
       
  //     },
  //     prefill : {
  //       name:'LPY',
  //       email: 'LPY@GMAIL.COM',
  //       contact: '90909090'
  //     },
  //     notes: {
  //       address: 'Online Shopping'
  //     },
  //     theme: {
  //       color: '#F37254'
  //     }
  //   };

  //   var razorPayObject = new Razorpay(options);
  //   razorPayObject.open();
  // }

  // processResponse(resp: any, orderForm:NgForm) {
  //   this.orderDetails.transactionId = resp.razorpay_payment_id;
  //   this.placeOrder(orderForm);
  // }
}
