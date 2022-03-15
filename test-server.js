"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const express = require('express');
const lambdaLocal = require('lambda-local');
const cors = require('cors');
const app = express();
const STAGE = 'prod';
// Process body as plain text as this is
// how it would come from API Gateway
app.use(cors());
app.use(express.text());
app.use('/trips', async (req, res) => {
    console.log('got a req: ', req);
    const event = await convertRequestToApiGatewayEvent(req);
    const result = await lambdaLocal
        .execute({
        lambdaPath: path_1.default.join(__dirname, 'lambdas/index'),
        lambdaHandler: 'handler',
        envfile: path_1.default.join(__dirname, '.env'),
        event: event
    });
    // Respond to HTTP request
    res
        .status(result.statusCode)
        .end(result.body);
});
app.listen(3000, () => console.log('listening on port: 3000'));
async function convertRequestToApiGatewayEvent(req) {
    let claims = {};
    if (req.headers.authorization) {
        claims = jwt_decode_1.default(req.headers.authorization.replace('bearer ', ''));
    }
    return {
        version: '2.0',
        routeKey: STAGE,
        rawPath: req.path,
        rawQueryString: req._parsedUrl.query,
        cookies: ['cookie1', 'cookie2'],
        headers: req.headers,
        queryStringParameters: req.query,
        requestContext: {
            accountId: '123456789012',
            apiId: 'api-id',
            authentication: {
                clientCert: {
                    clientCertPem: 'CERT_CONTENT',
                    subjectDN: 'www.example.com',
                    issuerDN: 'Example issuer',
                    serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
                    validity: {
                        notBefore: 'May 28 12:30:02 2019 GMT',
                        notAfter: 'Aug  5 09:36:04 2021 GMT',
                    },
                },
            },
            authorizer: {
                jwt: {
                    claims: claims,
                    scopes: ['scope1', 'scope2'],
                },
            },
            domainName: 'id.execute-api.us-east-1.amazonaws.com',
            domainPrefix: 'id',
            http: {
                method: req.method,
                path: req.path,
                protocol: 'HTTP/1.1',
                sourceIp: '127.0.0.1',
                userAgent: req.headers['user-agent'],
            },
            requestId: 'id',
            routeKey: STAGE,
            stage: STAGE,
            time: '12/Mar/2020:19:03:58 +0000',
            timeEpoch: 1583348638390,
        },
        body: req.body ? JSON.stringify(req.body) : null,
        pathParameters: req.params,
        isBase64Encoded: false,
        stageVariables: {
            stageVariable1: 'value1',
            stageVariable2: 'value2',
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LXNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw0REFBNkI7QUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFHdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBRXJCLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFFdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLCtCQUErQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sTUFBTSxHQUFHLE1BQU0sV0FBVztTQUMvQixPQUFPLENBQUM7UUFDUCxVQUFVLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO1FBQ2pELGFBQWEsRUFBRSxTQUFTO1FBQ3hCLE9BQU8sRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7UUFDckMsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDLENBQUE7SUFDQSwwQkFBMEI7SUFDOUIsR0FBRztTQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1NBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUE7QUFFSixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztBQUUvRCxLQUFLLFVBQVUsK0JBQStCLENBQUMsR0FBRztJQUM5QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtRQUM3QixNQUFNLEdBQUcsb0JBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEU7SUFDRCxPQUFPO1FBQ0wsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSTtRQUNqQixjQUFjLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLO1FBQ3BDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDL0IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1FBQ3BCLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxLQUFLO1FBQ2hDLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLEtBQUssRUFBRSxRQUFRO1lBQ2YsY0FBYyxFQUFFO2dCQUNkLFVBQVUsRUFBRTtvQkFDVixhQUFhLEVBQUUsY0FBYztvQkFDN0IsU0FBUyxFQUFFLGlCQUFpQjtvQkFDNUIsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsWUFBWSxFQUFFLGlEQUFpRDtvQkFDL0QsUUFBUSxFQUFFO3dCQUNSLFNBQVMsRUFBRSwwQkFBMEI7d0JBQ3JDLFFBQVEsRUFBRSwwQkFBMEI7cUJBQ3JDO2lCQUNGO2FBQ0Y7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFO29CQUNILE1BQU0sRUFBRSxNQUFNO29CQUNkLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7aUJBQzdCO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsd0NBQXdDO1lBQ3BELFlBQVksRUFBRSxJQUFJO1lBQ2xCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDZCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFNBQVMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQzthQUNyQztZQUNELFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSw0QkFBNEI7WUFDbEMsU0FBUyxFQUFFLGFBQWE7U0FDekI7UUFDRCxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDaEQsY0FBYyxFQUFFLEdBQUcsQ0FBQyxNQUFNO1FBQzFCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLGNBQWMsRUFBRTtZQUNkLGNBQWMsRUFBRSxRQUFRO1lBQ3hCLGNBQWMsRUFBRSxRQUFRO1NBQ3pCO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgand0IGZyb20gJ2p3dC1kZWNvZGUnO1xyXG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmNvbnN0IGxhbWJkYUxvY2FsID0gcmVxdWlyZSgnbGFtYmRhLWxvY2FsJyk7XHJcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJyk7XHJcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHJcblxyXG5jb25zdCBTVEFHRSA9ICdwcm9kJztcclxuXHJcbi8vIFByb2Nlc3MgYm9keSBhcyBwbGFpbiB0ZXh0IGFzIHRoaXMgaXNcclxuLy8gaG93IGl0IHdvdWxkIGNvbWUgZnJvbSBBUEkgR2F0ZXdheVxyXG5hcHAudXNlKGNvcnMoKSk7XHJcbmFwcC51c2UoZXhwcmVzcy50ZXh0KCkpXHJcblxyXG5hcHAudXNlKCcvdHJpcHMnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdnb3QgYSByZXE6ICcsIHJlcSlcclxuICAgIGNvbnN0IGV2ZW50ID0gYXdhaXQgY29udmVydFJlcXVlc3RUb0FwaUdhdGV3YXlFdmVudChyZXEpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbGFtYmRhTG9jYWxcclxuICAgIC5leGVjdXRlKHtcclxuICAgICAgbGFtYmRhUGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYXMvaW5kZXgnKSxcclxuICAgICAgbGFtYmRhSGFuZGxlcjogJ2hhbmRsZXInLFxyXG4gICAgICBlbnZmaWxlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLmVudicpLFxyXG4gICAgICBldmVudDogZXZlbnRcclxuICAgIH0pXHJcbiAgICAgIC8vIFJlc3BvbmQgdG8gSFRUUCByZXF1ZXN0XHJcbiAgcmVzXHJcbiAgLnN0YXR1cyhyZXN1bHQuc3RhdHVzQ29kZSlcclxuICAuZW5kKHJlc3VsdC5ib2R5KVxyXG4gIH0pXHJcblxyXG5hcHAubGlzdGVuKDMwMDAsICgpID0+IGNvbnNvbGUubG9nKCdsaXN0ZW5pbmcgb24gcG9ydDogMzAwMCcpKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnRSZXF1ZXN0VG9BcGlHYXRld2F5RXZlbnQocmVxKSB7XHJcbiAgICBsZXQgY2xhaW1zID0ge307XHJcbiAgICBpZiAocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbikge1xyXG4gICAgICBjbGFpbXMgPSBqd3QocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5yZXBsYWNlKCdiZWFyZXIgJywgJycpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZlcnNpb246ICcyLjAnLFxyXG4gICAgICByb3V0ZUtleTogU1RBR0UsXHJcbiAgICAgIHJhd1BhdGg6IHJlcS5wYXRoLFxyXG4gICAgICByYXdRdWVyeVN0cmluZzogcmVxLl9wYXJzZWRVcmwucXVlcnksXHJcbiAgICAgIGNvb2tpZXM6IFsnY29va2llMScsICdjb29raWUyJ10sXHJcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxyXG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHJlcS5xdWVyeSxcclxuICAgICAgcmVxdWVzdENvbnRleHQ6IHtcclxuICAgICAgICBhY2NvdW50SWQ6ICcxMjM0NTY3ODkwMTInLFxyXG4gICAgICAgIGFwaUlkOiAnYXBpLWlkJyxcclxuICAgICAgICBhdXRoZW50aWNhdGlvbjoge1xyXG4gICAgICAgICAgY2xpZW50Q2VydDoge1xyXG4gICAgICAgICAgICBjbGllbnRDZXJ0UGVtOiAnQ0VSVF9DT05URU5UJyxcclxuICAgICAgICAgICAgc3ViamVjdEROOiAnd3d3LmV4YW1wbGUuY29tJyxcclxuICAgICAgICAgICAgaXNzdWVyRE46ICdFeGFtcGxlIGlzc3VlcicsXHJcbiAgICAgICAgICAgIHNlcmlhbE51bWJlcjogJ2ExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExOmExJyxcclxuICAgICAgICAgICAgdmFsaWRpdHk6IHtcclxuICAgICAgICAgICAgICBub3RCZWZvcmU6ICdNYXkgMjggMTI6MzA6MDIgMjAxOSBHTVQnLFxyXG4gICAgICAgICAgICAgIG5vdEFmdGVyOiAnQXVnICA1IDA5OjM2OjA0IDIwMjEgR01UJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdXRob3JpemVyOiB7XHJcbiAgICAgICAgICBqd3Q6IHtcclxuICAgICAgICAgICAgY2xhaW1zOiBjbGFpbXMsXHJcbiAgICAgICAgICAgIHNjb3BlczogWydzY29wZTEnLCAnc2NvcGUyJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG9tYWluTmFtZTogJ2lkLmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tJyxcclxuICAgICAgICBkb21haW5QcmVmaXg6ICdpZCcsXHJcbiAgICAgICAgaHR0cDoge1xyXG4gICAgICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxyXG4gICAgICAgICAgcGF0aDogcmVxLnBhdGgsXHJcbiAgICAgICAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcclxuICAgICAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcclxuICAgICAgICAgIHVzZXJBZ2VudDogcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcXVlc3RJZDogJ2lkJyxcclxuICAgICAgICByb3V0ZUtleTogU1RBR0UsXHJcbiAgICAgICAgc3RhZ2U6IFNUQUdFLFxyXG4gICAgICAgIHRpbWU6ICcxMi9NYXIvMjAyMDoxOTowMzo1OCArMDAwMCcsXHJcbiAgICAgICAgdGltZUVwb2NoOiAxNTgzMzQ4NjM4MzkwLFxyXG4gICAgICB9LFxyXG4gICAgICBib2R5OiByZXEuYm9keSA/IEpTT04uc3RyaW5naWZ5KHJlcS5ib2R5KSA6IG51bGwsXHJcbiAgICAgIHBhdGhQYXJhbWV0ZXJzOiByZXEucGFyYW1zLFxyXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxyXG4gICAgICBzdGFnZVZhcmlhYmxlczoge1xyXG4gICAgICAgIHN0YWdlVmFyaWFibGUxOiAndmFsdWUxJyxcclxuICAgICAgICBzdGFnZVZhcmlhYmxlMjogJ3ZhbHVlMicsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH0iXX0=