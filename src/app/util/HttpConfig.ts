import { RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment";

export class HttpConfig {
  static apiUrl: string = environment.API_URL;
  static url: string;

  static getOptions(): RequestOptions {
    let headers = new Headers({ "Content-Type": "application/json" });
    return new RequestOptions({ headers: headers });
  }

  static getUrl(
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
