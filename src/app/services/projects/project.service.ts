import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private project: any;
  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  getAllProjects(): Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllProjects");
    return this.http.get(this.url, this.options);
  }

  getValueByProject(projectId) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(projectId);
    this.url = this.httpConfig.getUrl("getValueByProject", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
  getProject() {
    return this.project;
  }

  setProject(project:any) {
    this.project = project;
  }

}
