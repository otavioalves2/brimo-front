import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError, filter, repeatWhen, take } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(
    private http: HttpClient
  ) { }

  tweetAnalysis(keyword: string, language: string, limit: number, since: string, until: string) {
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
          return this.http.get(`${environment.root}/status/${JSON.parse(JSON.stringify(response)).task_id}`)
          .pipe(
            repeatWhen(obs => obs),
            filter(data => 
              JSON.parse(JSON.stringify(data)).state === "SUCCESS"
              ),
            take(1)
          )
        }),
        catchError(e => {
          return throwError(e);
        })
      );
  }
}
