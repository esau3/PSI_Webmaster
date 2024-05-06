import { Injectable } from '@angular/core';

import { Observable, of,catchError,throwError } from 'rxjs';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Page, Website } from '../types';
//import { WEBSITES } from '../mock-websites';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  private website = "http://10.101.151.25:3092/website";
  private websites = "http://10.101.151.25:3092/websites";
  private page = "http://10.101.151.25:3092/page";
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
     return this.http.get<Website>(this.website + '/' + _id)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteWebsite(_id:string):Observable<Website>{
    return this.http.delete<Website>(this.website + '/' + _id)
   .pipe(
     catchError(this.handleError)
   );
  }

  deletePage(id:string):Observable<Page>{
    return this.http.delete<Page>(this.page + '/' + id)
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
    return this.http.get<any>(this.page + '/' + _id)
   .pipe(
     catchError(this.handleError)
   );
  }

  getPage(_id: string):Observable<Page>{
    return this.http.get<Page>(this.page + '/' + _id)
   .pipe(
     catchError(this.handleError)
   );
  }


  //pagina a adicionar e id do website para colocar a pagina
  putPage(pageData: any, id: string) {
    //return this.http.put<Page>(this.website + '/' + id + '/page/' + page._id , page)
    return this.http.put<Page>(this.page + '/' + id , pageData)
    .pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any) {
    console.error('Erro:', error);
    return throwError('Erro ao enviar o website: ' + error.message);
  }
}