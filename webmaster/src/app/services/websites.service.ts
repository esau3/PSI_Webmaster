import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Website } from '../types';
import { WEBSITES } from '../mock-websites';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  constructor(
    private http: HttpClient) { }

    /** GET websitees from the server */
  getWebsitees(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websitesUrl)
  }

  private websitesUrl = '/websites';  // URL to web api

  getWebsite(id: number): Observable<Website> {
    // For now, assume that a website with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const website = WEBSITES.find((website: { id: number; }) => website.id === id)!;
    return of(website);
  }
}