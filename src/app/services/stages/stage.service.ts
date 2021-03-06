import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
import { HttpConfig } from 'src/app/util/HttpConfig';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  public stageList:Array<any>;
  private options: RequestOptions;
  private url: string;
  private varGet: Array<string>;

  constructor(private http: Http, private httpConfig : HttpConfig) { }

  getAllStages() : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("getAllStages");
    return this.http.get(this.url, this.options);
  }
  
  getStagesByProject(projectId) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(projectId);
    this.url = this.httpConfig.getUrl("getStagesByProject", this.varGet);
    return this.http.get(this.url, this.options);
  }
  
  saveStage(body : any) : Observable<Response> {
    this.options = this.httpConfig.getOptions();
    this.url = this.httpConfig.getUrl("saveStage");
    return this.http.post(this.url, body, this.options);
  }

  deleteStageByProject(projectId, stageId) : Observable<Response>{
    this.options = this.httpConfig.getOptions();
    this.varGet = new Array<string>();
    this.varGet.push(projectId);
    this.varGet.push(stageId);
    this.url = this.httpConfig.getUrl("deleteStageByProject", this.varGet);
    return this.http.get(this.url, this.options);
  }

}
