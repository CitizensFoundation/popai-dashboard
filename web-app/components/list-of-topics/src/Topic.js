import { LitElement, html, css } from 'lit-element';
import '../../dashboard-app/src/shadow-styles.js';
import { ShadowStyles } from '../../dashboard-app/src/shadow-styles.js';
import { BaseElement } from '../../dashboard-app/src/baseElement.js';
import '@material/mwc-textarea';
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-linear-progress';
import { FlexLayout } from '../../dashboard-app/src/flex-layout.js';
import { Data, DataLabels } from '../../dashboard-app/src/data.js';

export class Topic extends BaseElement {
  static get styles() {
    return [
      FlexLayout,
      ShadowStyles,
      css`
        :host {
          display: block;
          background-color: #fff;
          margin-bottom: 16px;
        }

        .mdc-card {
          max-width: 850px;
          padding: 16px;
          cursor: pointer;
        }
        .content {
          padding: 1rem;
          padding-bottom: 0;
        }
        .subtext {
          color: rgba(0, 0, 0, 0.54);
        }

        .group-spaced {
          justify-content: space-around;
        }

        .group-spaced > * {
          margin: 0 8px;
        }

        mwc-textarea {
          width: 300px;
        }

        mwc-icon {
          position: absolute;
          left: 16px;
          top: 16px;
          height: 96px;
          width: 96px;
        }

        .contentText {
          font-size: 16px !important;
        }

        .contentTitle {
          font-size: 20px;
          margin-top: 0;
        }

        mwc-button {
          margin-top: 24px;
          margin-left: 85px;
          margin-bottom: 32px;
        }

        mwc-textarea {
          line-height: 1;
        }

        mwc-icon {
          color: #000;
        }

        a {
          color: #444;
        }

        mwc-linear-progress {
          --mdc-theme-primary: #000;
          margin-top: 8px;
        }

        mwc-button.openButton {
          color: #000;
          --mdc-theme-primary: #000;
          width: 100%;
          margin-right: auto;
          margin-left: auto;
          margin-top: 32px;
          margin-bottom: 0px;
        }

        #trend-chart {
          height: 300px;
          width: 800px;
          margin-top: 32px;
        }

        #sentiment-chart {
          height: 150px;
          width: 800px;
          margin-top: 32px;
        }

        @media (max-width: 600px) {
          #sentiment-chart {
            height: 150px;
            width: 100%;
          }

          #trend-chart {
            height: 300px;
            width: 100%;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      topicData: { type: Object },
      fullView: { type: Boolean },
      responses: { type: Array },
      topicQuotes: { type: Array },
    };
  }

  render() {
    return html`
      <div class="mdc-card shadow-animation shadow-elevation-3dp">
        <div class="mdc-card__primary-action"
          style="${this.topicData.subTopicName==='All subtopics' ? `padding: 8px; border: 3px solid ${this.topicData.dataSet.borderColor}` : ''}"
        >
          <div class="mdc-card__media mdc-card__media--16-9 my-media"></div>
          <div class="content">
            <h2 class="mdc-typography--title contentTitle">
              ${this.topicData.topicName} - ${this.topicData.subTopicName}
            </h2>
          </div>
          <canvas id="trend-chart" width="800" height="300"></canvas>
          <canvas id="sentiment-chart" class="sentimentChart" width="800" height="150"></canvas>
        </div>
      </div>
    `;
  }

  _normalizeMap(min, max) {
    const delta = max - min;
    return function(val) {
      return (val - min) / delta;
    };
  }

  _normalizeArray(array, min, max) {
    return array.map(this._normalizeArray(0, 1));
  }

  _normalizeDocCount(year, docCount) {
    // https://commoncrawl.github.io/cc-crawl-statistics/plots/crawlsize/monthly.csv
    // using page column
    const commonCrawlYearlyVolume = {
      2013: 2245773667,
      2014: 2085977207,
      2015: 1824170527,
      2016: 2866282390,
      2017: 2914004423,
      2018: 3164247635,
      2019: 2471904965,
      2020: 2642471501,
      2021: 2527075799,
    };

    const fraction = docCount / (commonCrawlYearlyVolume[year] / 2866282390);

    return fraction;
  }

  async getTopicDomains() {
    const chartElement = this.shadowRoot.getElementById('trend-chart');

    fetch(`/api/trends/getTopicDomains?topic=${this.topicData.topicName}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responses => {
        const domainLabels = [];
        const counts = [];
        const domains = {};

        for (let i = 0; i < responses.length; i++) {
          const domainLabel = responses[i].key;
          domainLabels.push(domainLabel);
          //const docCount = responses[i].doc_count;
          const docCount = this._normalizeDocCount(parseInt(yearLabel), responses[i].doc_count);
          domains[responses[i].key] = docCount;
          counts.push(docCount);
        }
        const chart = new Chart(chartElement, {
          type: 'bar',
          data: {
            labels: domainLabels,
            datasets: [
              {
                data: counts,
                label: `Top Website Hits`,
                borderColor: this.topicData.dataSet.borderColor,
                fill: false,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            onClick: (event, item, legend) => {
              if (item && item.length > 0) {
                const idx = item[0].index;
                const url = `http://${domainLabels[idx]}`;
                window.open(url, '_blank');
              }
            },
            plugins: {
              tooltip: {
                enabled: true,
              },
            },
            /*            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return "";
                        }
                    }
                }
            }*/
          },
        });
      });
  }

  firstUpdatedTest() {
    super.firstUpdated();
    const trendChartElement = this.shadowRoot.getElementById('trend-chart');
    const sentimentChartElement = this.shadowRoot.getElementById('sentiment-chart');

    new Chart(trendChartElement, {
      type: 'line',
      data: {
        labels: this.topicData.dataSet.labels,
        datasets: [
          {
            data: this.topicData.dataSet.data,
            label: `${this.topicData.topicName} (${this.topicData.subTopicName}) - Trend Over Time`,
            borderColor: this.topicData.dataSet.borderColor,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    new Chart(sentimentChartElement, {
      type: 'bar',
      data: {
        labels: this.topicData.dataSet.labels,
        datasets: [
          {
            data: this.topicData.dataSet.dataSentiment,
            label: `${this.topicData.topicName} - Computed Sentiment`,
            borderColor: this.topicData.dataSet.borderColor,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            enabled: false,
          },
        },
        /*            scales: {
            y: {
                ticks: {
                    callback: function(value, index, values) {
                        return "";
                    }
                }
            }
        }*/
      },
    });
  }

  firstUpdated() {
    super.firstUpdated();
    //this.getTopicDomains();
    const topicName = this.topicData.topicName;
    const topicNameExtra = this.topicData.topicNameExtra || 'noextraname ';
    const subTopicNames = this.topicData.subTopicNames;

    let url;

    if (this.topicData.subTopicName === 'All subtopics') {
      url = `/api/trends/getTopicTrendsOverAll?topicName=${topicName}&topicNameExtra=${topicNameExtra}`;
    } else {
      url = `/api/trends/getTopicTrends?topicName=${topicName}&topicNameExtra=${topicNameExtra}&subTopicName1=${subTopicNames[0]}&subTopicName2=${subTopicNames[1]}&subTopicName3=${subTopicNames[2]}`;
    }

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responses => {
        this.responses = responses;
        const yearLabels = [];
        const counts = [];
        const sentiments = [];
        const years = {};

        for (let i = 0; i < responses.length; i++) {
          const yearLabel = responses[i].key_as_string.split('-')[0];
          yearLabels.push(yearLabel);
  //        const docCount = responses[i].doc_count;
          const docCount = this._normalizeDocCount(parseInt(yearLabel), responses[i].doc_count);

          years[responses[i].key_as_string.split('-')[0]] = docCount;
          sentiments.push(responses[i].averageSentimentScore.value);
          counts.push(docCount);
        }

        this.fire('years-and-counts', { topicName: this.topicData.topicName, years });

        const trendChartElement = this.shadowRoot.getElementById('trend-chart');
        const sentimentChartElement = this.shadowRoot.getElementById('sentiment-chart');

        new Chart(trendChartElement, {
          type: 'line',
          data: {
            labels: yearLabels,
            datasets: [
              {
                data: years,
                label: `${this.topicData.topicName} (${this.topicData.subTopicName}) - Trend Over Time`,
                borderColor: this.topicData.dataSet.borderColor,
                fill: false,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                enabled: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  /*callback: function(value, index, values) {
                    return '';
                  },*/
                },
              },
            },
          },
        });

        new Chart(sentimentChartElement, {
          type: 'bar',
          data: {
            labels: yearLabels,
            datasets: [
              {
                data: sentiments,
                label: `${this.topicData.topicName} - Computed Sentiment`,
                borderColor: this.topicData.dataSet.borderColor,
                fill: false,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                enabled: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                min: -0.5,
                max: 0.5,
              },
            },
          },
        });
      });
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('responses')) {
      setTimeout(() => {
        //this._setupChart();
      }, 200);
    }
  }
}
