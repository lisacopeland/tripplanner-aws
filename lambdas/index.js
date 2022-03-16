"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const trips_1 = require("./trips");
exports.handler = async (event) => {
    // const method = event.requestContext.http.method;
    // const queryString = event.queryStringParameters;
    console.log('querystring: ', event.queryStringParameters);
    const queryString = event.queryStringParameters;
    // const method = event.requestContext.http.method;
    // const search = event.queryStringParameters;
    // const account_id = search.account_id;
    return await trips_1.Trip.query(queryString.account_id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBK0I7QUFFbEIsUUFBQSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBZ0IsRUFBRTtJQUVqRCxtREFBbUQ7SUFDbkQsbURBQW1EO0lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQzFELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztJQUNoRCxtREFBbUQ7SUFDbkQsOENBQThDO0lBQzlDLHdDQUF3QztJQUN4QyxPQUFPLE1BQU0sWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWtCSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyaXAgfSBmcm9tICcuL3RyaXBzJztcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50KTogUHJvbWlzZTxhbnk+ID0+IHtcclxuXHJcbiAgICAvLyBjb25zdCBtZXRob2QgPSBldmVudC5yZXF1ZXN0Q29udGV4dC5odHRwLm1ldGhvZDtcclxuICAgIC8vIGNvbnN0IHF1ZXJ5U3RyaW5nID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzO1xyXG4gICAgY29uc29sZS5sb2coJ3F1ZXJ5c3RyaW5nOiAnLCBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnMpO1xyXG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnM7XHJcbiAgICAvLyBjb25zdCBtZXRob2QgPSBldmVudC5yZXF1ZXN0Q29udGV4dC5odHRwLm1ldGhvZDtcclxuICAgIC8vIGNvbnN0IHNlYXJjaCA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycztcclxuICAgIC8vIGNvbnN0IGFjY291bnRfaWQgPSBzZWFyY2guYWNjb3VudF9pZDtcclxuICAgIHJldHVybiBhd2FpdCBUcmlwLnF1ZXJ5KHF1ZXJ5U3RyaW5nLmFjY291bnRfaWQpO1xyXG59O1xyXG5cclxuLyogaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xyXG5cclxuY29uc3QgVEFCTEVfTkFNRSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgfHwgJyc7XHJcblxyXG5jb25zdCBkYiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKCk6IFByb21pc2U8YW55PiA9PiB7XHJcblxyXG4gIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgIFRhYmxlTmFtZTogVEFCTEVfTkFNRVxyXG4gIH07XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRiLnNjYW4ocGFyYW1zKS5wcm9taXNlKCk7XHJcbiAgICByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDAsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLkl0ZW1zKSB9O1xyXG4gIH0gY2F0Y2ggKGRiRXJyb3IpIHtcclxuICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDUwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkoZGJFcnJvcikgfTtcclxuICB9XHJcbn07ICovIl19