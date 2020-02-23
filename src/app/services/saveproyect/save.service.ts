import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  private options: RequestOptions;
  private url: string;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  saveProject(body : any) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("saveProject");
    return this.http.post(this.url, body, this.options);
  }

}
