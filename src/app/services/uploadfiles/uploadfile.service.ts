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
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  pushFileToStorage(file: any): Observable<Response> {
    this.options = this.httpConfig.getMultipartOptions();
    this.url = this.httpConfig.getUrl("saveFile");
    return this.http.post(this.url, file, this.options);
  }

  getFileByDeliverable(body) {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(body.projectId);
    this.varGet.push(body.stageId);
    this.varGet.push(body.deliverableId);
    this.url = this.httpConfig.getUrl("getFileByDeliverable", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
  getFileBlob(url: string): Observable<Response> {
    this.options = this.httpConfig.getFileOptions();
    return this.http.get(url, this.options);
  }

}
