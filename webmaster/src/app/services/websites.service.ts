import { Injectable } from '@angular/core';

import { Observable, of,catchError,throwError } from 'rxjs';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Page, Website } from '../types';
//import { WEBSITES } from '../mock-websites';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  private websiteUrl = "http://10.101.151.25:3092/website";
  private websitesUrl = "http://10.101.151.25:3092/websites";
  constructor(
    private http: HttpClient) { }

    /** GET websites from the server */
  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websitesUrl).pipe(
      catchError(this.handleError)
    );
  }

    // URL to web api

  getWebsite(_id: number): Observable<Website> {
    // For now, assume that a website with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const url=this.websitesUrl+"/"+_id.toString();
     return this.http.get<Website>(this.websitesUrl)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteWebsite(_id:number):Observable<Website>{
    const url=this.websitesUrl+"/"+_id.toString();
    return this.http.delete<Website>(this.websitesUrl)
   .pipe(
     catchError(this.handleError)
   );
  }

  postWebsite(websiteData: string): Observable<any> {

    return this.http.post(this.websiteUrl, websiteData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPage(_id:number):Observable<Page>{
    const url="page/"+_id.toString();
    return this.http.delete<Page>(this.websitesUrl)
   .pipe(
     catchError(this.handleError)
   );
  }



  private handleError(error: any) {
    console.error('Erro:', error);
    return throwError('Erro ao enviar o website: ' + error.message);
  }
}