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

  constructor(private http: Http, private httpConfig : HttpConfig) { }
  
  getAllPaymentMethods() : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllPaymentMethods");
    return this.http.get(this.url, this.options);
  }

}
