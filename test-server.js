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
process.env.TABLE_NAME = 'trips';
process.env.BACKGROUND_PIC_BUCKET_NAME = 'trips-background-pics';
// Process body as plain text as this is
// how it would come from API Gateway
app.use(cors());
app.use(express.text());
app.use('/trips', async (req, res) => {
    console.log('got a req: ', req);
    const event = await convertRequestToApiGatewayEvent(req);
    try {
        const result = await lambdaLocal
            .execute({
            lambdaPath: path_1.default.join(__dirname, 'lambdas/index'),
            lambdaHandler: 'handler',
            envfile: path_1.default.join(__dirname, '.env'),
            event: event
        });
        // Respond to HTTP request
        const body = (result.body !== undefined) ? JSON.stringify(result.body) : '';
        if (result.statusCode) {
            res.status(result.statusCode);
        }
        else {
            res.status(200);
        }
        res.send(body);
    }
    catch (e) {
        res.status(500).send(e);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LXNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw0REFBNkI7QUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLHVCQUF1QixDQUFDO0FBRWpFLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFFdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLCtCQUErQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFdBQVc7YUFDN0IsT0FBTyxDQUFDO1lBQ1AsVUFBVSxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztZQUNqRCxhQUFhLEVBQUUsU0FBUztZQUN4QixPQUFPLEVBQUUsY0FBSSxDQUFDLElB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QUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ2hELGNBQWMsRUFBRSxHQUFHLENBQUMsTUFBTTtRQUMxQixlQUFlLEVBQUUsS0FBSztRQUN0QixjQUFjLEVBQUU7WUFDZCxjQUFjLEVBQUUsUUFBUTtZQUN4QixjQUFjLEVBQUUsUUFBUTtTQUN6QjtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGp3dCBmcm9tICdqd3QtZGVjb2RlJztcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCBsYW1iZGFMb2NhbCA9IHJlcXVpcmUoJ2xhbWJkYS1sb2NhbCcpO1xyXG5jb25zdCBjb3JzID0gcmVxdWlyZSgnY29ycycpO1xyXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5jb25zdCBTVEFHRSA9ICdwcm9kJztcclxucHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSA9ICd0cmlwcyc7XHJcbnByb2Nlc3MuZW52LkJBQ0tHUk9VTkRfUElDX0JVQ0tFVF9OQU1FID0gJ3RyaXBzLWJhY2tncm91bmQtcGljcyc7XHJcblxyXG4vLyBQcm9jZXNzIGJvZHkgYXMgcGxhaW4gdGV4dCBhcyB0aGlzIGlzXHJcbi8vIGhvdyBpdCB3b3VsZCBjb21lIGZyb20gQVBJIEdhdGV3YXlcclxuYXBwLnVzZShjb3JzKCkpO1xyXG5hcHAudXNlKGV4cHJlc3MudGV4dCgpKVxyXG5cclxuYXBwLnVzZSgnL3RyaXBzJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2dvdCBhIHJlcTogJywgcmVxKVxyXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgY29udmVydFJlcXVlc3RUb0FwaUdhdGV3YXlFdmVudChyZXEpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsYW1iZGFMb2NhbFxyXG4gICAgICAuZXhlY3V0ZSh7XHJcbiAgICAgICAgbGFtYmRhUGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYXMvaW5kZXgnKSxcclxuICAgICAgICBsYW1iZGFIYW5kbGVyOiAnaGFuZGxlcicsXHJcbiAgICAgICAgZW52ZmlsZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJy5lbnYnKSxcclxuICAgICAgICBldmVudDogZXZlbnRcclxuICAgICAgfSlcclxuICAgIC8vIFJlc3BvbmQgdG8gSFRUUCByZXF1ZXN0XHJcbiAgICBjb25zdCBib2R5ID0gKHJlc3VsdC5ib2R5ICE9PSB1bmRlZmluZWQpID8gSlNPTi5zdHJpbmdpZnkocmVzdWx0LmJvZHkpIDogJyc7XHJcbiAgICBpZiAocmVzdWx0LnN0YXR1c0NvZGUpIHtcclxuICAgICAgcmVzLnN0YXR1cyhyZXN1bHQuc3RhdHVzQ29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDIwMCk7XHJcbiAgICB9XHJcbiAgICByZXMuc2VuZChib2R5KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlKTtcclxuICB9XHJcbn0pO1xyXG5cclxuYXBwLmxpc3RlbigzMDAwLCAoKSA9PiBjb25zb2xlLmxvZygnbGlzdGVuaW5nIG9uIHBvcnQ6IDMwMDAnKSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb252ZXJ0UmVxdWVzdFRvQXBpR2F0ZXdheUV2ZW50KHJlcSkge1xyXG4gIGxldCBjbGFpbXMgPSB7fTtcclxuICBpZiAocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbikge1xyXG4gICAgY2xhaW1zID0gand0KHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24ucmVwbGFjZSgnYmVhcmVyICcsICcnKSk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICB2ZXJzaW9uOiAnMi4wJyxcclxuICAgIHJvdXRlS2V5OiBTVEFHRSxcclxuICAgIHJhd1BhdGg6IHJlcS5wYXRoLFxyXG4gICAgcmF3UXVlcnlTdHJpbmc6IHJlcS5fcGFyc2VkVXJsLnF1ZXJ5LFxyXG4gICAgY29va2llczogWydjb29raWUxJywgJ2Nvb2tpZTInXSxcclxuICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxyXG4gICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiByZXEucXVlcnksXHJcbiAgICByZXF1ZXN0Q29udGV4dDoge1xyXG4gICAgICBhY2NvdW50SWQ6ICcxMjM0NTY3ODkwMTInLFxyXG4gICAgICBhcGlJZDogJ2FwaS1pZCcsXHJcbiAgICAgIGF1dGhlbnRpY2F0aW9uOiB7XHJcbiAgICAgICAgY2xpZW50Q2VydDoge1xyXG4gICAgICAgICAgY2xpZW50Q2VydFBlbTogJ0NFUlRfQ09OVEVOVCcsXHJcbiAgICAgICAgICBzdWJqZWN0RE46ICd3d3cuZXhhbXBsZS5jb20nLFxyXG4gICAgICAgICAgaXNzdWVyRE46ICdFeGFtcGxlIGlzc3VlcicsXHJcbiAgICAgICAgICBzZXJpYWxOdW1iZXI6ICdhMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMTphMScsXHJcbiAgICAgICAgICB2YWxpZGl0eToge1xyXG4gICAgICAgICAgICBub3RCZWZvcmU6ICdNYXkgMjggMTI6MzA6MDIgMjAxOSBHTVQnLFxyXG4gICAgICAgICAgICBub3RBZnRlcjogJ0F1ZyAgNSAwOTozNjowNCAyMDIxIEdNVCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGF1dGhvcml6ZXI6IHtcclxuICAgICAgICBqd3Q6IHtcclxuICAgICAgICAgIGNsYWltczogY2xhaW1zLFxyXG4gICAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBkb21haW5OYW1lOiAnaWQuZXhlY3V0ZS1hcGkudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20nLFxyXG4gICAgICBkb21haW5QcmVmaXg6ICdpZCcsXHJcbiAgICAgIGh0dHA6IHtcclxuICAgICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXHJcbiAgICAgICAgcGF0aDogcmVxLnBhdGgsXHJcbiAgICAgICAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXHJcbiAgICAgICAgc291cmNlSXA6ICcxMjcuMC4wLjEnLFxyXG4gICAgICAgIHVzZXJBZ2VudDogcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXSxcclxuICAgICAgfSxcclxuICAgICAgcmVxdWVzdElkOiAnaWQnLFxyXG4gICAgICByb3V0ZUtleTogU1RBR0UsXHJcbiAgICAgIHN0YWdlOiBTVEFHRSxcclxuICAgICAgdGltZTogJzEyL01hci8yMDIwOjE5OjAzOjU4ICswMDAwJyxcclxuICAgICAgdGltZUVwb2NoOiAxNTgzMzQ4NjM4MzkwLFxyXG4gICAgfSxcclxuICAgIGJvZHk6IHJlcS5ib2R5ID8gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpIDogbnVsbCxcclxuICAgIHBhdGhQYXJhbWV0ZXJzOiByZXEucGFyYW1zLFxyXG4gICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcclxuICAgIHN0YWdlVmFyaWFibGVzOiB7XHJcbiAgICAgIHN0YWdlVmFyaWFibGUxOiAndmFsdWUxJyxcclxuICAgICAgc3RhZ2VWYXJpYWJsZTI6ICd2YWx1ZTInLFxyXG4gICAgfSxcclxuICB9O1xyXG59Il19