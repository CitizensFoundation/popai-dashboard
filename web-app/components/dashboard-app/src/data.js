const createRandomData = length => {
  return new Array(length)
    .fill()
    .map((a, i) => Math.round((Math.random() * (Math.random() * 5000) * 5000) / 5000) + 1000);
};

const createRandomSentimentData = length => {
  return new Array(length)
    .fill()
    .map((a, i) => (Math.random() * (Math.random() * 1.8) * 1.8) / 2.0 - 0.6);
};

export const DataLabels = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

export const Data = [
  {
    title: 'Biometric identifiers ',
    topicName: 'Biometric identifiers',
    subTopicName: 'Privacy',
    subTopicNames: ['Privacy', 'Privacy - negative', 'Privacy - positive'],
    description: `...missing desription...`,
    dataSet: {
      data: createRandomData(DataLabels.length),
      dataSentiment: createRandomSentimentData(DataLabels.length),
      labels: DataLabels,
      label: 'Biometric identifiers - Privacy',
      borderColor: '#3e95cd',
      fill: false,
    },
    randomCount: createRandomData(DataLabels.length)[0],
  },
  {
    title: 'Biometric identifiers ',
    topicName: 'Biometric identifiers',
    subTopicName: 'Efficiency, Reliability, Accuracy',
    subTopicNames: [
      'Efficiency, Reliability, Accuracy',
      'Efficiency, Reliability, Accuracy - negative',
      'Efficiency, Reliability, Accuracy - positive',
    ],
    description: `...missing desription...`,
    dataSet: {
      data: createRandomData(DataLabels.length),
      dataSentiment: createRandomSentimentData(DataLabels.length),
      labels: DataLabels,
      label: 'Biometric identifiers - Efficiency, Reliability, Accuracy',
      borderColor: '#3e95cd',
      fill: false,
    },
    randomCount: createRandomData(DataLabels.length)[0],
  },
  {
    title: 'Biometric identifiers ',
    topicName: 'Biometric identifiers',
    subTopicName: 'Legitimacy',
    subTopicNames: [
      'Legitimacy',
      'Legitimacy - positive',
      'Legitimacy - negative',
    ],
    description: `...missing desription...`,
    dataSet: {
      data: createRandomData(DataLabels.length),
      dataSentiment: createRandomSentimentData(DataLabels.length),
      labels: DataLabels,
      label: 'Biometric identifiers - Legitimacy',
      borderColor: '#3e95cd',
      fill: false,
    },
    randomCount: createRandomData(DataLabels.length)[0],
  },
  {
    title: 'Biometric identifiers ',
    topicName: 'Biometric identifiers',
    subTopicName: 'Transparency, Accountability',
    subTopicNames: [
      'Transparency, Accountability',
      'Transparency, Accountability - negative',
      'Transparency, Accountability - positive',
    ],
    description: `...missing desription...`,
    dataSet: {
      data: createRandomData(DataLabels.length),
      dataSentiment: createRandomSentimentData(DataLabels.length),
      labels: DataLabels,
      label: 'Biometric identifiers - Transparency, Accountability',
      borderColor: '#3e95cd',
      fill: false,
    },
    randomCount: createRandomData(DataLabels.length)[0],
  },
  {
    title: 'Biometric identifiers ',
    topicName: 'Biometric identifiers',
    subTopicName: 'Discrimination',
    subTopicNames: [
      'Discrimination ',
      'Discrimination - positive',
      'Discrimination - negative',
    ],
    description: `...missing desription...`,
    dataSet: {
      data: createRandomData(DataLabels.length),
      dataSentiment: createRandomSentimentData(DataLabels.length),
      labels: DataLabels,
      label: 'Biometric identifiers - Discrimination',
      borderColor: '#3e95cd',
      fill: false,
    },
    randomCount: createRandomData(DataLabels.length)[0],
  }
];
