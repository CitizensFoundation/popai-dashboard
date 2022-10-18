import { html, css, LitElement } from 'lit-element';
import { Data } from '../../dashboard-app/src/data.js';
import { ShadowStyles } from '../../dashboard-app/src/shadow-styles.js';

import './Topic.js';
import { BaseElement } from '../../dashboard-app/src/baseElement.js';

export class ListOfTopics extends BaseElement {
  static get styles() {
    return [
      ShadowStyles,
      css`
        :host {
          --page-one-text-color: #000;

          padding: 25px;
          color: var(--page-one-text-color);
        }

        .mdc-card {
          max-width: 850px;
          padding: 16px;
          background-color: #fff;
          margin-bottom: 32px;
        }
        .content {
          padding: 1rem;
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

        .container {
          display: flex;
          flex-direction: column;
          flex-basis: auto;
          width: 100%;
        }

        .contentText {
          font-size: 16px !important;
          color: #6f6f6f;
        }

        .contentTitle {
          font-size: 20px;
          margin-top: 0;
        }

        a {
          color: rgba(0, 0, 0, 0.64);
        }

        .readMore {
          color: #555;
        }

        @media (max-width: 600px) {
          .mdc-card {
            max-width: 100%;
            padding: 16px;
            margin: 0;
            background-color: #fff;
            margin-bottom: 32px;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  renderIntro() {
    return html`
      <div class="mdc-card shadow-animation shadow-elevation-3dp" @click="${this._openTopic}">
        <div class="mdc-card__primary-action">
          <div class="mdc-card__media mdc-card__media--16-9 my-media"></div>
          <div class="content">
            <h2 class="mdc-typography--title contentTitle">Introduction to the popAI Dashboard</h2>
            <div class="mdc-typography--body1 subtext contentText">
              <p>
                The present dashboard is part of the Horizon 2020 funded project PopAI. It is a
                visual representation of the data acquired on several topics where AI can be used in
                the work of law enforcement agencies and the justice system. Each of the major
                topics is broken down into subtopics of potential concern or interest to citizens.
              </p>

              <p>
                The data was sourced from the CommonCrawl archives for the period 2013-2021.This
                research provides both quantitative and qualitative insights into how citizens
                discuss this in the internet domain. Firstly, by comparing the volume of data for
                each topic and/or subtopic, we can get a better understanding of how much interest
                each one generates. Then, by reviewing the sentiment scores, one can see whether the
                overall discussion is positive, negative or neutral."
              </p>
              <p>
                The popAI Dashboard is a part of the EU funded
                <a href="https://www.pop-ai.eu/" target="_blank">pop AI</a> project.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCitizensEngagment() {
    return html``;
  }

  render() {
    return html`
      <div class="container">
        ${this.renderIntro()}
        ${Data.map(item =>
          item.topic == 'Citizen engagment'
            ? html`
                ${this.renderCitizensEngagment()}
                <one-topic .topicData="${item}"></one-topic>
              `
            : html`
                <one-topic .topicData="${item}"></one-topic>
              `,
        )}
      </div>
    `;
  }
}
