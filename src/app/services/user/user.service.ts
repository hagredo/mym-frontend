import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http) { }

  validUser(userName: string, password: string): Observable<Response> {
    this.options = HttpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(userName);
    this.varGet.push(password);
    this.url = HttpConfig.getUrl("userlogin", this.varGet);
    return this.http.get(this.url, this.options);
  }

}
