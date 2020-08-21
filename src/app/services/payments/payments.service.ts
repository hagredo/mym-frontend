import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) {}
  
  savePayment(body : any) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("savePayment");
    return this.http.post(this.url, body, this.options);
  }

  getPaymentsByProject(projectId) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(projectId);
    this.url = this.httpConfig.getUrl("getPaymentsByProject", this.varGet);
    return this.http.get(this.url, this.options);
  }

  deletePayment(paymentId) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(paymentId);
    this.url = this.httpConfig.getUrl("deletePayment", this.varGet);
    return this.http.get(this.url, this.options);
  }

}
