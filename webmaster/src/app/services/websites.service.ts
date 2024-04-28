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

    // URL to web api

  getWebsite(_id: string): Observable<Website> {
    // For now, assume that a website with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
     return this.http.get<Website>(this.website + '/' + _id)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteWebsite(_id:number):Observable<Website>{
    return this.http.delete<Website>(this.websites)
   .pipe(
     catchError(this.handleError)
   );
  }

  postWebsite(websiteData: any): Observable<any> {

    console.log(websiteData);
    return this.http.post(this.website, websiteData)
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



  private handleError(error: any) {
    console.error('Erro:', error);
    return throwError('Erro ao enviar o website: ' + error.message);
  }
}