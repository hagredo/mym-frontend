import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  getAllClients() : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllClients");
    return this.http.get(this.url, this.options);
  }

  saveClient(body : any) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("saveClient");
    return this.http.post(this.url, body, this.options);
  }

}
