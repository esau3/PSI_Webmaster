import { Injectable } from '@angular/core';

import { Observable, of,catchError,throwError } from 'rxjs';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Page, Report, Rule, Website } from '../types';
//import { WEBSITES } from '../mock-websites';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  /*
private website = "http://10.101.151.25:3092/website/";
private websites = "http://10.101.151.25:3092/websites";
private page = "http://10.101.151.25:3092/page/";
private eval_page = "http://10.101.151.25:3092/eval/";
private eval_pages = "http://10.101.151.25:3092/evals";*/
// comenta o url descomentado e descomenta o outro
private website = "http://127.0.0.1:3092/website/";
private websites = "http://127.0.0.1:3092/websites";
private page = "http://127.0.0.1:3092/page/";
private eval_page = "http://127.0.0.1:3092/eval/";
private eval_pages = "http://127.0.0.1:3092/evals";

  constructor(
    private http: HttpClient) { }

    /** GET websites from the server */
  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websites).pipe(
      catchError(this.handleError)
    );
  }

  /** GET websites from the server */
  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(this.page).pipe(
      catchError(this.handleError)
    );
  }

    // URL to web api

  getWebsite(_id: string): Observable<Website> {
    // For now, assume that a website with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
     return this.http.get<Website>(this.website + _id)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteWebsite(_id:string):Observable<Website>{
    return this.http.delete<Website>(this.website + _id)
   .pipe(
     catchError(this.handleError)
   );
  }

  deletePage(id:string):Observable<Page>{
    return this.http.delete<Page>(this.page + id)
   .pipe(
     catchError(this.handleError)
   );
  }

  postWebsite(websiteData: any): Observable<any> {
    return this.http.post(this.website, websiteData)
      .pipe(
        catchError(this.handleError)
      );
  }
  startEvaluation(_id: string):Observable<any>{
    return this.http.post<any>(this.eval_page + _id, "")
   .pipe(
     catchError(this.handleError)
   );
  }

  getEvaluation(_id: string):Observable<any>{
    return this.http.get<any>(this.eval_page + _id)
   .pipe(
     catchError(this.handleError)
   );
  }


  getPage(_id: string):Observable<Page>{
    return this.http.get<Page>(this.page + _id)
   .pipe(
     catchError(this.handleError)
   );
  }


  //pagina a adicionar e id do website para colocar a pagina
  putPage(pageData: any, id: string) {
    return this.http.put<Page>(this.website + id, pageData)
    //return this.http.put<Page>(this.page + '/' + id , pageData)
    .pipe(
      catchError(this.handleError)
    );
  }

  //wrong urls
  getReport(id:string):Observable<Report>{
    return this.http.get<Report>(this.eval_page + id)
   .pipe(
     catchError(this.handleError)
   );
  }
//wrong urls
  getReports():Observable<Report[]>{
    return this.http.get<Report[]>(this.eval_pages)
    .pipe(
      catchError(this.handleError)
    );
  }

  getRules():Observable<Rule[]>{
    return this.http.get<Rule[]>(this.eval_pages)
   .pipe(
     catchError(this.handleError)
   );
  }

  getRule(id:string):Observable<Rule>{
    return this.http.get<Rule>(this.eval_page + id)
    .pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any) {
    return throwError('Erro ao enviar o website: ' + error.message);
  }
}