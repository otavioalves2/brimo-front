import { Component, OnInit } from '@angular/core';
import { AnalysisService } from 'src/app/services/analysis.service';

@Component({
  selector: 'app-form-beginner',
  templateUrl: './form-beginner.component.html',
  styleUrls: ['./form-beginner.component.scss']
})
export class FormBeginnerComponent implements OnInit {
  keyword: string = "";
  language: string = "pt";
  limit: string = "100";
  since: string = "2021-11-01";
  until: string = "2021-11-02";

  result: string = "Placeholder para mostrar o resultado da request";
  constructor(private analysisService: AnalysisService) { }

  ngOnInit(): void {
  }

  lowLimit(){
    this.limit = "100"
  }

  mediumLimit(){
    this.limit = "1000"
  }

  highLimit(){
    this.limit = "10000"
  }

  submitForTweetAnalysis(){
    this.analysisService.tweetAnalysis(this.keyword, this.language, this.limit, this.since, this.until).subscribe(response => {
      response.subscribe(result => {
        console.log(JSON.parse(JSON.stringify(result)).result);
        this.result = JSON.parse(JSON.stringify(result)).result;
      })
    })
  }
}
