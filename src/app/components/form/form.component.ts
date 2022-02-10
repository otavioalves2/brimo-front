import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AnalysisService } from 'src/app/services/analysis.service';
declare const Loader: any;
import * as WordCloud from 'src/assets/wordcloud2'
import * as FileSaver from 'file-saver';

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

  hasContent: boolean = false;
  showSaveButton: boolean = false;

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
  multiAxisData: any;
  multiAxisOptions: any;
  constructor(private analysisService: AnalysisService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    let today = new Date();
    this.minDateValue = new Date();
    this.minDateValue.setDate(today.getDate() - 6);
    this.maxDateValue = new Date();
    this.maxDateValue.setDate(today.getDate());

    this.multiAxisOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    this.rangeDates = [this.minDateValue, this.maxDateValue];

    this.configSent = {
      theme: 'lara-light-indigo',
      dark: false,
      inputStyle: 'outlined',
      ripple: true
    };

    this.configPol = {
      theme: 'lara-light-indigo',
      dark: false,
      inputStyle: 'outlined',
      ripple: true
    };
    this.updateDateRange();
  }

  updateDateRange() {
    this.since = this.rangeDates[0].getFullYear() + "-" + ("0" + (this.rangeDates[0].getMonth() + 1)).slice(-2) + "-" + ("0" + this.rangeDates[0].getDate()).slice(-2);
    this.until = this.rangeDates[1].getFullYear() + "-" + ("0" + (this.rangeDates[1].getMonth() + 1)).slice(-2) + "-" + ("0" + this.rangeDates[1].getDate()).slice(-2);
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

  submitForTweetAnalysis(uploadedTweets = "") {
    if (+this.limit < 10) {
      this.messageService.add({ severity: 'error', summary: 'Quantidade de tweets muito baixa', detail: 'A quantidade de tweets analisados tem de ser pelo menos 10' });
      return;
    }
    Loader.open()
    this.analysisService.tweetAnalysis(this.keyword, this.language, +this.limit, this.since, this.until, uploadedTweets).subscribe(response => {
      response.subscribe(result => {
        let responseClassifyJson = JSON.parse((JSON.parse(JSON.stringify(result)).result.classify)[0]);
        let responseCorpus = JSON.parse(JSON.stringify(result)).result.corpus;
        let responseTweets = JSON.parse(JSON.stringify(result)).result.tweets
        let emotions = {
          "raiva": responseClassifyJson[0],
          "antecipacao": responseClassifyJson[1],
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

        this.multiAxisData = {
          labels: ['Tristeza', 'Alegria', 'Medo', 'Nojo', 'Raiva', 'Surpresa'],
          datasets: [{
            label: 'Emoções',
            backgroundColor: [
              '#EC407A',
              '#AB47BC',
              '#42A5F5',
              '#7E57C2',
              '#66BB6A',
              '#FFCA28',
              '#26A69A'
            ],
            data: [emotions.tristeza, emotions.alegria, emotions.medo, emotions.nojo, emotions.raiva, emotions.surpresa]
          }]
        };

        let polaridade = {
          "positivo": emotions.positivo > 0 ? ((emotions.positivo * 100) / (emotions.positivo + emotions.negativo)) / 100 : 0,
          "negativo": emotions.negativo > 0 ? ((emotions.negativo * 100) / (emotions.positivo + emotions.negativo)) / 100 : 0
        }
        this.dataPol = {
          labels: ['Positivo', 'Negativo'],
          datasets: [
            {
              data: [polaridade.positivo, polaridade.negativo],
              backgroundColor: [
                "#36A2EB",
                "#FF6384"
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FF6384"
              ]
            }
          ]
        };

        this.tweets = [];

        responseTweets.forEach((tweet: any) => {
          this.tweets.push({ text: tweet })
        });

        this.hasContent = true;
        let weight = Math.floor(+this.limit/100)
        switch (weight) {
          case 1:
            weight = 5
            break;
          case 2:
            weight = 5
            break;
          case 3:
            weight = 4
            break;
          case 4:
            weight = 4
            break;
          case 5:
            weight = 3
            break;
          case 6:
            weight = 3
            break;
          case 7:
            weight = 2
            break;
          case 8:
            weight = 2
            break;
          case 9:
            weight = 1
            break;
          case 10:
            weight = 1
            break;
        }
        WordCloud(document.getElementById('wordcloudCanvas'), { list: responseCorpus, gridSize: 18, weightFactor: weight });
        Loader.close();
        if (this.table) {
          this.table.reset();
        }
      })
    })
  }

  myUploader(event: { files: any; }) {
    let reader = new FileReader();

    reader.readAsText(event.files[0]);

    reader.onload = (tweetsJsonArray) => {
      let result = tweetsJsonArray?.target?.result as string
      this.submitForTweetAnalysis(result)
    }
  }

  downloadTweets() {
    const blob = new Blob(this.tweets.map(tweet => { return tweet.text + '\n' }), { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "brimo_tweets.txt");
  }

  downloadImage(graphIndex: number) {
    var canvas = document.getElementsByTagName('canvas') as HTMLCollectionOf<HTMLCanvasElement>;
    let context = canvas[graphIndex].getContext('2d');
    // set compositing to draw all new pixels (background) UNDER
    // the existing chart pixels
    if (context) {
      context.globalCompositeOperation = 'destination-over';

      // fill the main canvas with a background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas[graphIndex].width, canvas[graphIndex].height)

      // always clean up ... reset compositing to default
      context.globalCompositeOperation = 'source-over';
      canvas[graphIndex].toBlob(blob => {
        if (blob) {
          FileSaver.saveAs(blob, "image.png");
        }
      });
    }
  }
}
