import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class DeliverableService {

  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  getAllDeliverables(): Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllDeliverables");
    return this.http.get(this.url, this.options);
  }
  
  getDeliverablesByProject(projectId) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(projectId);
    this.url = this.httpConfig.getUrl("getDeliverablesByProject", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
  saveDeliverable(body : any) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("saveDeliverable");
    return this.http.post(this.url, body, this.options);
  }

}
