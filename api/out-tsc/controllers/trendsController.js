"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsController = void 0;
const express_1 = __importDefault(require("express"));
//import Post from './post.interface';
const { Client } = require("@opensearch-project/opensearch");
const Redis = require("ioredis");
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
}
else {
    redisClient = new Redis();
}
class TrendsController {
    constructor() {
        this.path = "/api/trends";
        this.router = express_1.default.Router();
        this.getTopicDomains = async (request, response) => {
            const redisKey = `Trends_Domains_${request.query.topic}_V5`;
            redisClient.get(redisKey).then(async (results) => {
                if (results) {
                    console.log("Sending cached trends");
                    response.send(JSON.parse(results));
                }
                else {
                    const body = {
                        aggs: {
                            averageSentimentScore: {
                                avg: {
                                    field: "sentimentScore",
                                },
                            },
                        },
                        size: 0,
                        stored_fields: ["*"],
                        script_fields: {},
                        docvalue_fields: [{ field: "createdAt", format: "date_time" }],
                        _source: { excludes: [] },
                        query: {
                            bool: {
                                must: [
                                    { term: { relevanceScore: 1 } },
                                    /* { term: { oneTwoRelevanceScoreV2: 1 } },
                                    { term: { oneTwoRelevanceScore: 1 } }*/
                                ],
                                filter: [
                                    { match_all: {} },
                                    { match_phrase: { topic: request.query.topic } },
                                    {
                                        range: {
                                            createdAt: {
                                                gte: "2006-03-01T01:57:35.660Z",
                                                lte: "2023-03-01T01:57:35.660Z",
                                                format: "strict_date_optional_time",
                                            },
                                        },
                                    },
                                ],
                                should: [],
                                must_not: [
                                //                { "term" : { "relevanceScore" : 0 } }
                                ],
                            },
                        },
                    };
                    try {
                        const result = await this.esClient.search({
                            index: "urls",
                            body: body,
                        });
                        const finalResults = result.body.aggregations["2"].buckets;
                        const finalSentimentResults = result.body.aggregations["averageSentimentScore"].buckets;
                        //await redisClient.set(redisKey, JSON.stringify(finalResults), "EX", 60*60*24*30*2240);
                        response.send(finalResults);
                        console.log(result);
                    }
                    catch (ex) {
                        console.error(ex);
                        response.sendStatus(500);
                    }
                }
            });
        };
        this.getTopicTrendsOverAll = async (request, response) => {
            const redisKey = `Trends_OverAll${request.query.topicName}_${request.query.topicNameExtra}_V9`;
            redisClient.get(redisKey).then(async (results) => {
                if (results) {
                    console.log("Sending cached trends");
                    response.send(JSON.parse(results));
                }
                else {
                    console.log(request.query);
                    const body = {
                        aggs: {
                            "2": {
                                date_histogram: {
                                    field: "createdAt",
                                    calendar_interval: "1y",
                                    time_zone: "Atlantic/Reykjavik",
                                    min_doc_count: 1,
                                },
                                "aggs": {
                                    "averageSentimentScore": {
                                        avg: {
                                            field: "sentimentScore",
                                        },
                                    },
                                }
                            },
                        },
                        size: 0,
                        stored_fields: ["*"],
                        script_fields: {},
                        docvalue_fields: [{ field: "createdAt", format: "date_time" }],
                        _source: { excludes: [] },
                        query: {
                            bool: {
                                must: [
                                    { term: { relevanceScore: 1 } },
                                    /*{ term: { oneTwoRelevanceScoreV2: 1 } },
                                    { term: { oneTwoRelevanceScore: 1 } }*/
                                ],
                                filter: [
                                    { match_all: {} },
                                    {
                                        "bool": {
                                            "should": [
                                                {
                                                    "match_phrase": {
                                                        "topic.keyword": request.query.topicName
                                                    }
                                                },
                                                {
                                                    "match_phrase": {
                                                        "topic.keyword": request.query.topicNameExtra
                                                    }
                                                }
                                            ],
                                            "minimum_should_match": 1
                                        }
                                    },
                                    {
                                        range: {
                                            createdAt: {
                                                gte: "2006-03-01T01:57:35.660Z",
                                                lte: "2023-03-01T01:57:35.660Z",
                                                format: "strict_date_optional_time",
                                            },
                                        },
                                    }
                                ],
                                should: [],
                                must_not: [
                                //                { "term" : { "relevanceScore" : 0 } }
                                ],
                            },
                        },
                    };
                    try {
                        const result = await this.esClient.search({
                            index: "urls",
                            body: body,
                        });
                        const finalResults = result.body.aggregations["2"].buckets;
                        console.log(finalResults);
                        //const sentimentResults = result.body.aggregations["averageSentimentScore"].buckets;
                        await redisClient.set(redisKey, JSON.stringify(finalResults), "EX", 60 * 60 * 24 * 30 * 2240);
                        response.send(finalResults);
                        //console.log(result);
                    }
                    catch (ex) {
                        console.error(ex);
                        response.sendStatus(500);
                    }
                }
            });
        };
        this.getTopicTrends = async (request, response) => {
            const redisKey = `Trends_${request.query.topicName}_${request.query.subTopicName1}_${request.query.subTopicName2}_${request.query.subTopicName3}_V9`;
            redisClient.get(redisKey).then(async (results) => {
                if (results) {
                    console.log("Sending cached trends");
                    response.send(JSON.parse(results));
                }
                else {
                    console.log(request.query);
                    const body = {
                        aggs: {
                            "2": {
                                date_histogram: {
                                    field: "createdAt",
                                    calendar_interval: "1y",
                                    time_zone: "Atlantic/Reykjavik",
                                    min_doc_count: 1,
                                },
                                "aggs": {
                                    "averageSentimentScore": {
                                        avg: {
                                            field: "sentimentScore",
                                        },
                                    },
                                }
                            },
                        },
                        size: 0,
                        stored_fields: ["*"],
                        script_fields: {},
                        docvalue_fields: [{ field: "createdAt", format: "date_time" }],
                        _source: { excludes: [] },
                        query: {
                            bool: {
                                must: [
                                    { term: { relevanceScore: 1 } },
                                    /*{ term: { oneTwoRelevanceScoreV2: 1 } },
                                    { term: { oneTwoRelevanceScore: 1 } }*/
                                ],
                                filter: [
                                    { match_all: {} },
                                    {
                                        "bool": {
                                            "should": [
                                                {
                                                    "match_phrase": {
                                                        "topic.keyword": request.query.topicName
                                                    }
                                                },
                                                {
                                                    "match_phrase": {
                                                        "topic.keyword": request.query.topicNameExtra
                                                    }
                                                }
                                            ],
                                            "minimum_should_match": 1
                                        }
                                    },
                                    {
                                        range: {
                                            createdAt: {
                                                gte: "2006-03-01T01:57:35.660Z",
                                                lte: "2023-03-01T01:57:35.660Z",
                                                format: "strict_date_optional_time",
                                            },
                                        },
                                    },
                                    {
                                        "bool": {
                                            "should": [
                                                {
                                                    "match_phrase": {
                                                        "subTopic.keyword": request.query.subTopicName1
                                                    }
                                                },
                                                {
                                                    "match_phrase": {
                                                        "subTopic.keyword": request.query.subTopicName2
                                                    }
                                                },
                                                {
                                                    "match_phrase": {
                                                        "subTopic.keyword": request.query.subTopicName3
                                                    }
                                                }
                                            ],
                                            "minimum_should_match": 1
                                        }
                                    },
                                ],
                                should: [],
                                must_not: [
                                //                { "term" : { "relevanceScore" : 0 } }
                                ],
                            },
                        },
                    };
                    try {
                        const result = await this.esClient.search({
                            index: "urls",
                            body: body,
                        });
                        const finalResults = result.body.aggregations["2"].buckets;
                        console.log(finalResults);
                        //const sentimentResults = result.body.aggregations["averageSentimentScore"].buckets;
                        await redisClient.set(redisKey, JSON.stringify(finalResults), "EX", 60 * 60 * 24 * 30 * 2240);
                        response.send(finalResults);
                        //console.log(result);
                    }
                    catch (ex) {
                        console.error(ex);
                        response.sendStatus(500);
                    }
                }
            });
        };
        this.getTopicQuotes = async (request, response) => {
            const redisKey = `Quotes_${request.query.topic}_V4`;
            redisClient.get(redisKey).then(async (results) => {
                if (results) {
                    console.log("Sending cached quotes");
                    response.send(JSON.parse(results));
                }
                else {
                    let returnQuotes = [];
                    const years = [
                        "2013",
                        "2014",
                        "2015",
                        "2016",
                        "2017",
                        "2018",
                        "2019",
                        "2020",
                        "2021",
                    ];
                    const must = [];
                    const mustNot = [];
                    /*must.push({ term: { oneTwoRelevanceScoreV3: 1 } });
                    must.push({ term: { oneTwoRelevanceScoreV2: 1 } });
                    must.push({ term: { oneTwoRelevanceScore: 1 } });*/
                    // Main
                    //mustNot.push({ term: { relevanceScore: 0 } });
                    /*must.push({
                      "script": {
                        "script": "doc['paragraph'].length < 100"
                      }
                    })*/
                    for (let i = 0; i < years.length; i++) {
                        const year = years[i];
                        const body = {
                            from: 0,
                            size: 1,
                            query: {
                                function_score: {
                                    query: {
                                        bool: {
                                            must: must,
                                            filter: [
                                                { match_all: {} },
                                                { match_phrase: { topic: request.query.topic } },
                                                {
                                                    range: {
                                                        createdAt: {
                                                            gte: `${year}-01-01T00:00:00.000Z`,
                                                            lte: `${year}-12-31T23:59:59.990Z`,
                                                            format: "strict_date_optional_time",
                                                        },
                                                    },
                                                },
                                                /*                      {
                                                  range: {
                                                    pageRank: {
                                                      gte: 0,
                                                      lte: 100000000,
                                                      format: "strict_date_optional_time",
                                                    },
                                                  },
                                                },*/
                                            ],
                                            should: [],
                                            must_not: mustNot,
                                        },
                                    },
                                    random_score: { seed: "5435435" },
                                },
                            },
                        };
                        try {
                            const result = await this.esClient.search({
                                index: "urls",
                                body: body,
                            });
                            returnQuotes = returnQuotes.concat(result.body.hits.hits);
                        }
                        catch (ex) {
                            console.error(ex);
                            response.sendStatus(500);
                        }
                    }
                    const forever = true;
                    await redisClient.set(redisKey, JSON.stringify(returnQuotes), "EX", forever ? 60 * 60 * 24 * 30 * 2240 : 3);
                    response.send(returnQuotes);
                }
            });
        };
        this.createAPost = (request, response) => {
            //    const post: Post = request.body;
            //    this.posts.push(post);
            //    response.send(post);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/getTopicTrends", this.getTopicTrends);
        this.router.get(this.path + "/getTopicQuotes", this.getTopicQuotes);
        this.router.get(this.path + "/getTopicDomains", this.getTopicDomains);
        this.router.get(this.path + "/getTopicTrendsOverAll", this.getTopicTrendsOverAll);
        //    this.router.post(this.path, this.createAPost);
    }
    setEsClient(esClient) {
        this.esClient = esClient;
    }
}
exports.TrendsController = TrendsController;
