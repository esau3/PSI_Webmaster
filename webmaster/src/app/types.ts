import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Website {
    _id: number;
    name: string;
    URL: string;
    pages: Page[];
    register_date: Date;
    eval_date: Date;
    monitor_state: string;
}

export interface Page {
    _id: number;
    page_URL: string;
    eval_date: Date;
    monitor_state: string;
}

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body' | 'events';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType: 'text'; //podemos alterar para
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
  }