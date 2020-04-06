import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {

  private options: RequestOptions;
  private url: string;
  constructor(private http: Http, private httpConfig : HttpConfig) { }


  pushFileToStorage(file: File): Observable<Response> {
    const data: FormData = new FormData();
    data.append('file', file);
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("saveFile");
    return this.http.post(this.url, file, this.options);
  }
}
