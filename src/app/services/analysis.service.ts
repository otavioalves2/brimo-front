import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(
    private http: HttpClient
  ) { }

  tweetAnalysis(keyword: string, language: string, limit: string, since: string, until: string) {
    const requestObj = {
      "keyword": keyword,
      "language": language,
      "limit": limit, 
      "since": since,
      "until": until
    }
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }
    httpOptions.body = requestObj
    return this.http.post(`${environment.root}/classify`, requestObj)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(e => {
          return throwError(e);
        })
      );
  }
}
