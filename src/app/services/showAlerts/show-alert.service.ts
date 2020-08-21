import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class ShowAlertService {
  private options: RequestOptions;
  private varGet: Array<string>;
  private url: string;
  
  constructor(private http: Http, private httpConfig : HttpConfig) { }

  getAllAlerts() : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllAlerts");
    return this.http.get(this.url, this.options);
  }
  
  markAlertAsRead(alertId) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(alertId);
    this.url = this.httpConfig.getUrl("markAlertAsRead", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
}
