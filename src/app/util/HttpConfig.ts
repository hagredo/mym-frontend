import { RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { environment } from "../../environments/environment";
import { AuthGuardService } from '../services/auth/auth-guard.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpConfig {
  apiUrl: string = environment.API_URL;
  url: string;

  constructor(private authService: AuthGuardService){}

  getOptions(): RequestOptions {
    let headers = new Headers({ "Content-Type": "application/json", "Authorization":  this.authService.getToken()});
    return new RequestOptions({ headers: headers });
  }

  getFileOptions(): RequestOptions {
    let headers = new Headers({ });
    return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
  }

  getMultipartOptions(): RequestOptions {
    let headers = new Headers({ "Authorization":  this.authService.getToken() });
    return new RequestOptions({ headers: headers });
  }

  getUrl(
    ref: string,
    get?: Array<string>,
    acceptNull: boolean = false
  ): string {
    if (get) {
      this.url = this.apiUrl + ref;
      get.forEach(element => {
        if (acceptNull || (element && element != "null")) {
          this.url += "/" + element;
        }
      });

      return this.url;
    } else {
      return this.apiUrl + ref;
    }
  }

  static getOptionsFormData(): RequestOptions {
    let headers = new Headers();
    return new RequestOptions({ headers: headers });
  }

}
