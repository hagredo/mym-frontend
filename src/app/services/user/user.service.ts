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

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  validUser(userName: string, password: string): Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(userName);
    this.varGet.push(password);
    this.url = this.httpConfig.getUrl("userlogin", this.varGet);
    return this.http.get(this.url, this.options);
  }

  getAllUsers() : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllUsers");
    return this.http.get(this.url, this.options);
  }
  
  getUsersByTeam(teamId) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(teamId);
    this.url = this.httpConfig.getUrl("getUsersByTeam", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
}
