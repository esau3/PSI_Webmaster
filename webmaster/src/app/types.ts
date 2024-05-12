import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Website {
    _id: string;
    name: string;
    URL: string;
    pages: Page[];
    register_date: Date;
    eval_date: Date;
    monitor_state: string;
}

export interface Page {
    _id: string;
    page_URL: string;
    eval_date: Date;
    monitor_state: string;
    report:Report;
}

export interface Report {
    _id: string;
    total_passed: number;
    total_warning: number;
    total_failed: number;
    total_inapplicable: number;
    rules:Rule[];
}

export interface Rule {
    _id: string;
    code: string;
    name: string;
    passed: number;
    warning: number;
    failed: number;
    inapplicable: number;
    outcome: string;
    rule_type: [string]; //como o backend ja refere nao coloquei
}
export interface errorProb{
    errorNoProb:number;
    errorProb:number;
    errorAProb:number;
    errorAAProb:number;
    errorAAAProb:number;
    commonError:[string,number][];
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