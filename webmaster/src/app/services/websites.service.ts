import { Injectable } from '@angular/core';

import { Observable, of,catchError,throwError } from 'rxjs';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Page, Website } from '../types';
//import { WEBSITES } from '../mock-websites';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  private websitesUrl = 'api/websites';
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

  postWebsite(json: JSON):Observable<JSON>{
    return this.http.post<JSON>(this.websitesUrl, json)
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



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}