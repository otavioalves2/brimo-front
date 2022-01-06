import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalysisService } from 'src/app/services/analysis.service';
declare const Loader: any;
import * as WordCloud from 'src/assets/wordcloud2'

export interface Tweets {
  text: string;
  pol: string;
  sent: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormBeginnerComponent implements OnInit {
  keyword: string = "";
  language: string = "pt";
  limit: number = 200;
  since: string = "2021-11-01";
  until: string = "2021-11-02";

  advanced: boolean = false;

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
  constructor(private analysisService: AnalysisService) { }

  ngOnInit(): void {
    let today = new Date();
    this.minDateValue = new Date();
    this.minDateValue.setDate(today.getDate() - 6);
    this.maxDateValue = new Date();
    this.maxDateValue.setDate(today.getDate());

    this.rangeDates = [this.minDateValue, this.maxDateValue];

    this.tweets = [
      { text: "descer o cacete no controle da tv pra ver se pega = machine learning", pol: "negativo", sent: "raiva" },
      { text: "e agora será que esses sintomas são de rinite sinusite h1n1 h3n2 covid h2o ou hb20 hbo max", pol: "negativo", sent: "raiva" },
      { text: "Energia nuclear é *a* energia limpa que dá pra rolar em escala suficiente e em tempo curto o suficiente pra reduzir emissão de carbono o tanto que precisamos  Mas cês não querem nuclear por causa de acidentes que causaram MUITO menos dano que a emissão de carbono equivalente.", pol: "negativo", sent: "raiva" }];
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
    Loader.open()
    this.analysisService.tweetAnalysis(this.keyword, this.language, this.limit, this.since, this.until).subscribe(response => {
      response.subscribe(result => {
        console.log(JSON.parse(JSON.stringify(result)).result);
        let responseJson = JSON.parse(JSON.stringify(result)).result;
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
              data: [responseJson.tristeza, responseJson.alegria, responseJson.medo, responseJson.nojo, responseJson.raiva, responseJson.surpresa]
            }
          ]
        };
        Loader.close()
      })
    })
  }
}
