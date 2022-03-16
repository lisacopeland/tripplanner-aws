import { Trip } from './trips';

export const handler = async (event): Promise<any> => {

    // const method = event.requestContext.http.method;
    // const queryString = event.queryStringParameters;
    console.log('querystring: ', event.queryStringParameters);
    const queryString = event.queryStringParameters;
    // const method = event.requestContext.http.method;
    // const search = event.queryStringParameters;
    // const account_id = search.account_id;
    return await Trip.query(queryString.account_id);
};

/* import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (): Promise<any> => {

  const params = {
    TableName: TABLE_NAME
  };

  try {
    const response = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}; */