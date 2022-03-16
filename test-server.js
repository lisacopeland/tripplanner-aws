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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LXNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw0REFBNkI7QUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFHdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUVqQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBRXZCLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSwrQkFBK0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RCxNQUFNLE1BQU0sR0FBRyxNQUFNLFdBQVc7U0FDL0IsT0FBTyxDQUFDO1FBQ1AsVUFBVSxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztRQUNqRCxhQUFhLEVBQUUsU0FBUztRQUN4QixPQUFPLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO1FBQ3JDLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFBO0lBQ0EsMEJBQTBCO0lBQzlCLEdBQUc7U0FDRixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2pCLENBQUMsQ0FBQyxDQUFBO0FBRUosR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7QUFFL0QsS0FBSyxVQUFVLCtCQUErQixDQUFDLEdBQUc7SUFDOUMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDN0IsTUFBTSxHQUFHLG9CQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2hFO0lBQ0QsT0FBTztRQUNMLE9BQU8sRUFBRSxLQUFLO1FBQ2QsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUk7UUFDakIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSztRQUNwQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBQy9CLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztRQUNwQixxQkFBcUIsRUFBRSxHQUFHLENBQUMsS0FBSztRQUNoQyxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsY0FBYztZQUN6QixLQUFLLEVBQUUsUUFBUTtZQUNmLGNBQWMsRUFBRTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsYUFBYSxFQUFFLGNBQWM7b0JBQzdCLFNBQVMsRUFBRSxpQkFBaUI7b0JBQzVCLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFlBQVksRUFBRSxpREFBaUQ7b0JBQy9ELFFBQVEsRUFBRTt3QkFDUixTQUFTLEVBQUUsMEJBQTBCO3dCQUNyQyxRQUFRLEVBQUUsMEJBQTBCO3FCQUNyQztpQkFDRjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRTtvQkFDSCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2lCQUM3QjthQUNGO1lBQ0QsVUFBVSxFQUFFLHdDQUF3QztZQUNwRCxZQUFZLEVBQUUsSUFBSTtZQUNsQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixTQUFTLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7YUFDckM7WUFDRCxTQUFTLEVBQUUsSUFBSTtZQUNmLFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLFNBQVMsRUFBRSxhQUFhO1NBQ3pCO1FBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ2hELGNBQWMsRUFBRSxHQUFHLENBQUMsTUFBTTtRQUMxQixlQUFlLEVBQUUsS0FBSztRQUN0QixjQUFjLEVBQUU7WUFDZCxjQUFjLEVBQUUsUUFBUTtZQUN4QixjQUFjLEVBQUUsUUFBUTtTQUN6QjtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGp3dCBmcm9tICdqd3QtZGVjb2RlJztcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCBsYW1iZGFMb2NhbCA9IHJlcXVpcmUoJ2xhbWJkYS1sb2NhbCcpO1xyXG5jb25zdCBjb3JzID0gcmVxdWlyZSgnY29ycycpO1xyXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5cclxuY29uc3QgU1RBR0UgPSAncHJvZCc7XHJcbnByb2Nlc3MuZW52LlRBQkxFX05BTUUgPSAndHJpcHMnO1xyXG5cclxuLy8gUHJvY2VzcyBib2R5IGFzIHBsYWluIHRleHQgYXMgdGhpcyBpc1xyXG4vLyBob3cgaXQgd291bGQgY29tZSBmcm9tIEFQSSBHYXRld2F5XHJcbmFwcC51c2UoY29ycygpKTtcclxuYXBwLnVzZShleHByZXNzLnRleHQoKSlcclxuXHJcbmFwcC51c2UoJy90cmlwcycsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2dvdCBhIHJlcTogJywgcmVxKVxyXG4gICAgY29uc3QgZXZlbnQgPSBhd2FpdCBjb252ZXJ0UmVxdWVzdFRvQXBpR2F0ZXdheUV2ZW50KHJlcSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsYW1iZGFMb2NhbFxyXG4gICAgLmV4ZWN1dGUoe1xyXG4gICAgICBsYW1iZGFQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGFtYmRhcy9pbmRleCcpLFxyXG4gICAgICBsYW1iZGFIYW5kbGVyOiAnaGFuZGxlcicsXHJcbiAgICAgIGVudmZpbGU6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuZW52JyksXHJcbiAgICAgIGV2ZW50OiBldmVudFxyXG4gICAgfSlcclxuICAgICAgLy8gUmVzcG9uZCB0byBIVFRQIHJlcXVlc3RcclxuICByZXNcclxuICAuc3RhdHVzKHJlc3VsdC5zdGF0dXNDb2RlKVxyXG4gIC5lbmQocmVzdWx0LmJvZHkpXHJcbiAgfSlcclxuXHJcbmFwcC5saXN0ZW4oMzAwMCwgKCkgPT4gY29uc29sZS5sb2coJ2xpc3RlbmluZyBvbiBwb3J0OiAzMDAwJykpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29udmVydFJlcXVlc3RUb0FwaUdhdGV3YXlFdmVudChyZXEpIHtcclxuICAgIGxldCBjbGFpbXMgPSB7fTtcclxuICAgIGlmIChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKSB7XHJcbiAgICAgIGNsYWltcyA9IGp3dChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnJlcGxhY2UoJ2JlYXJlciAnLCAnJykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmVyc2lvbjogJzIuMCcsXHJcbiAgICAgIHJvdXRlS2V5OiBTVEFHRSxcclxuICAgICAgcmF3UGF0aDogcmVxLnBhdGgsXHJcbiAgICAgIHJhd1F1ZXJ5U3RyaW5nOiByZXEuX3BhcnNlZFVybC5xdWVyeSxcclxuICAgICAgY29va2llczogWydjb29raWUxJywgJ2Nvb2tpZTInXSxcclxuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXHJcbiAgICAgIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogcmVxLnF1ZXJ5LFxyXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xyXG4gICAgICAgIGFjY291bnRJZDogJzEyMzQ1Njc4OTAxMicsXHJcbiAgICAgICAgYXBpSWQ6ICdhcGktaWQnLFxyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uOiB7XHJcbiAgICAgICAgICBjbGllbnRDZXJ0OiB7XHJcbiAgICAgICAgICAgIGNsaWVudENlcnRQZW06ICdDRVJUX0NPTlRFTlQnLFxyXG4gICAgICAgICAgICBzdWJqZWN0RE46ICd3d3cuZXhhbXBsZS5jb20nLFxyXG4gICAgICAgICAgICBpc3N1ZXJETjogJ0V4YW1wbGUgaXNzdWVyJyxcclxuICAgICAgICAgICAgc2VyaWFsTnVtYmVyOiAnYTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTE6YTEnLFxyXG4gICAgICAgICAgICB2YWxpZGl0eToge1xyXG4gICAgICAgICAgICAgIG5vdEJlZm9yZTogJ01heSAyOCAxMjozMDowMiAyMDE5IEdNVCcsXHJcbiAgICAgICAgICAgICAgbm90QWZ0ZXI6ICdBdWcgIDUgMDk6MzY6MDQgMjAyMSBHTVQnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF1dGhvcml6ZXI6IHtcclxuICAgICAgICAgIGp3dDoge1xyXG4gICAgICAgICAgICBjbGFpbXM6IGNsYWltcyxcclxuICAgICAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkb21haW5OYW1lOiAnaWQuZXhlY3V0ZS1hcGkudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20nLFxyXG4gICAgICAgIGRvbWFpblByZWZpeDogJ2lkJyxcclxuICAgICAgICBodHRwOiB7XHJcbiAgICAgICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXHJcbiAgICAgICAgICBwYXRoOiByZXEucGF0aCxcclxuICAgICAgICAgIHByb3RvY29sOiAnSFRUUC8xLjEnLFxyXG4gICAgICAgICAgc291cmNlSXA6ICcxMjcuMC4wLjEnLFxyXG4gICAgICAgICAgdXNlckFnZW50OiByZXEuaGVhZGVyc1sndXNlci1hZ2VudCddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVxdWVzdElkOiAnaWQnLFxyXG4gICAgICAgIHJvdXRlS2V5OiBTVEFHRSxcclxuICAgICAgICBzdGFnZTogU1RBR0UsXHJcbiAgICAgICAgdGltZTogJzEyL01hci8yMDIwOjE5OjAzOjU4ICswMDAwJyxcclxuICAgICAgICB0aW1lRXBvY2g6IDE1ODMzNDg2MzgzOTAsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJvZHk6IHJlcS5ib2R5ID8gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpIDogbnVsbCxcclxuICAgICAgcGF0aFBhcmFtZXRlcnM6IHJlcS5wYXJhbXMsXHJcbiAgICAgIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXHJcbiAgICAgIHN0YWdlVmFyaWFibGVzOiB7XHJcbiAgICAgICAgc3RhZ2VWYXJpYWJsZTE6ICd2YWx1ZTEnLFxyXG4gICAgICAgIHN0YWdlVmFyaWFibGUyOiAndmFsdWUyJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfSJdfQ==