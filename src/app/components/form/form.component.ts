import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AnalysisService } from 'src/app/services/analysis.service';
declare const Loader: any;
import * as WordCloud from 'src/assets/wordcloud2'

export interface Tweets {
  text: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormBeginnerComponent implements OnInit {
  keyword: string = "";
  language: string = "pt";
  limit: number = 100;
  since: string = "2021-11-01";
  until: string = "2021-11-02";

  advanced: boolean = false;

  @ViewChild('table') table: any;

  dataSent: any;
  chartOptionsSent: any;
  configSent: any;

  dataPol: any;
  chartOptionsPol: any;
  configPol: any;

  tweets: Tweets[] = [];

  rangeDates!: Date[];
  minDateValue: Date = new Date();
  maxDateValue: Date = new Date();
  constructor(private analysisService: AnalysisService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    let today = new Date();
    this.minDateValue = new Date();
    this.minDateValue.setDate(today.getDate() - 6);
    this.maxDateValue = new Date();
    this.maxDateValue.setDate(today.getDate());

    this.rangeDates = [this.minDateValue, this.maxDateValue];

    this.configSent = {
      theme: 'lara-light-indigo',
      dark: false,
      inputStyle: 'outlined',
      ripple: true
    };
    this.dataSent = {
      labels: ['Tristeza', 'Alegria', 'Medo', 'Nojo', 'Raiva', 'Surpresa'],
      datasets: [
        {
          label: 'Sentimentos',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: [65, 59, 90, 81, 56, 55]
        }
      ]
    };

    this.configPol = {
      theme: 'lara-light-indigo',
      dark: false,
      inputStyle: 'outlined',
      ripple: true
    };
    this.dataPol = {
      labels: ['Positivo', 'Negativo'],
      datasets: [
        {
          data: [300, 50],
          backgroundColor: [
            "#FF6384",
            "#36A2EB"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB"
          ]
        }
      ]
    };
  }

  updateDateRange(){
    this.since = this.rangeDates[0].getFullYear() + "-"  + ("0"+(this.rangeDates[0].getMonth()+1)).slice(-2) + "-" + ("0" + this.rangeDates[0].getDate()).slice(-2) ;
    this.until = this.rangeDates[1].getFullYear() + "-"  + ("0"+(this.rangeDates[1].getMonth()+1)).slice(-2) + "-" + ("0" + this.rangeDates[1].getDate()).slice(-2) ;
  }
  updateChartOptionsSent() {
    this.chartOptionsSent = this.configSent && this.configSent.dark ? this.getDarkThemeSent() : this.getLightThemeSent();
  }

  getLightThemeSent() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        r: {
          pointLabels: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
          angleLines: {
            color: '#ebedef'
          }
        }
      }
    }
  }

  getDarkThemeSent() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        r: {
          pointLabels: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
          angleLines: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    }
  }

  updateChartOptionsPol() {
    this.chartOptionsPol = this.configPol && this.configPol.dark ? this.getDarkThemePol() : this.getLightThemePol();
  }

  getLightThemePol() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  getDarkThemePol() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      }
    }
  }

  lowLimit() {
    this.limit = 100
  }

  mediumLimit() {
    this.limit = 1000
  }

  highLimit() {
    this.limit = 10000
  }

  submitForTweetAnalysis() {
    if(+this.limit < 10){
      this.messageService.add({severity:'error', summary:'Quantidade de tweets muito baixa', detail:'A quantidade de tweets analisados tem de ser pelo menos 10'});
      return;
    }
    Loader.open()
    this.analysisService.tweetAnalysis(this.keyword, this.language, +this.limit, this.since, this.until).subscribe(response => {
      response.subscribe(result => {
        let responseClassifyJson = JSON.parse((JSON.parse(JSON.stringify(result)).result.classify)[0]);
        let responseCorpus = JSON.parse(JSON.stringify(result)).result.corpus;
        let responseTweets = JSON.parse(JSON.stringify(result)).result.tweets
        let emotions = {
          "raiva": responseClassifyJson[0],
          "antecipacao":responseClassifyJson[1],
          "nojo": responseClassifyJson[2],
          "medo": responseClassifyJson[3],
          "alegria": responseClassifyJson[4],
          "tristeza": responseClassifyJson[5],
          "surpresa": responseClassifyJson[6],
          "confianca": responseClassifyJson[7],
          "positivo": responseClassifyJson[8],
          "negativo": responseClassifyJson[9]
        }
        let total = emotions.nojo + emotions.raiva + emotions.alegria + emotions.tristeza + emotions.surpresa + emotions.medo
        emotions.nojo = emotions.nojo > 0 ? ((emotions.nojo * 100) / total) / 100 : 0
        emotions.raiva = emotions.raiva > 0 ? ((emotions.raiva * 100) / total) / 100 : 0
        emotions.alegria = emotions.alegria > 0 ? ((emotions.alegria * 100) / total) / 100 : 0
        emotions.tristeza = emotions.tristeza > 0 ? ((emotions.tristeza * 100) / total) / 100 : 0
        emotions.surpresa = emotions.surpresa > 0 ? ((emotions.surpresa * 100) / total) / 100 : 0
        emotions.medo = emotions.medo > 0 ? ((emotions.medo * 100) / total) / 100 : 0
        console.log(emotions);
        this.dataSent = {
          labels: ['Tristeza', 'Alegria', 'Medo', 'Nojo', 'Raiva', 'Surpresa'],
          datasets: [
            {
              label: 'Sentimentos',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              pointBackgroundColor: 'rgba(255,99,132,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255,99,132,1)',
              data: [emotions.tristeza, emotions.alegria, emotions.medo, emotions.nojo, emotions.raiva, emotions.surpresa]
            }
          ]
        };
        let polaridade = {"positivo": emotions.positivo > 0 ? ((emotions.positivo * 100) / (emotions.positivo + emotions.negativo)) / 100 : 0,
        "negativo": emotions.negativo > 0 ? ((emotions.negativo * 100) / (emotions.positivo + emotions.negativo)) / 100 : 0}
        this.dataPol = {
          labels: ['Positivo', 'Negativo'],
          datasets: [
            {
              data: [polaridade.positivo, polaridade.negativo],
              backgroundColor: [
                "#FF6384",
                "#36A2EB"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
              ]
            }
          ]
        };
        
        responseTweets.forEach((tweet: any) => {
          this.tweets.push({text:tweet})
        });
        WordCloud(document.getElementById('wordcloudCanvas'), { list: responseCorpus, gridSize: Math.round(16 * 600 / 400), weightFactor: 10} );
        Loader.close();
        this.table.reset();
      })
    })
  }
}
