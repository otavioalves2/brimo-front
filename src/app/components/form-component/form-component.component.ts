import { Component, OnInit } from '@angular/core';
import { AnalysisService } from 'src/app/services/analysis.service';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss']
})
export class FormComponentComponent implements OnInit {
  keyword: string = "bolsonaro";
  language: string = "pt";
  limit: string = "100";
  since: string = "2017-02-02";
  until: string = "2017-02-03";
  constructor(private analysisService: AnalysisService) { }

  ngOnInit(): void {
  }

  submitForTweetAnalysis(){
    this.analysisService.tweetAnalysis(this.keyword, this.language, this.limit, this.since, this.until).subscribe(response => {
      console.log(response)
    })
  }
}
