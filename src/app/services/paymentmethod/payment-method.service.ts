import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }
  
  getAllPaymentMethods() : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllPaymentMethods");
    return this.http.get(this.url, this.options);
  }

  savePaymentMethod(body : any) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("savePaymentMethod");
    return this.http.post(this.url, body, this.options);
  }

  deletePaymentMethod(paymentMethodId : string) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(paymentMethodId);
    this.url = this.httpConfig.getUrl("deletePaymentMethod", this.varGet);
    return this.http.get(this.url, this.options);
  }

}
