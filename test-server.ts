import path from "path";
import jwt from 'jwt-decode';
const express = require('express')
const lambdaLocal = require('lambda-local');
const cors = require('cors');
const app = express();


const STAGE = 'prod';
process.env.TABLE_NAME = 'trips';

// Process body as plain text as this is
// how it would come from API Gateway
app.use(cors());
app.use(express.text())

app.use('/trips', async (req, res) => {
    console.log('got a req: ', req)
    const event = await convertRequestToApiGatewayEvent(req);
    const result = await lambdaLocal
    .execute({
      lambdaPath: path.join(__dirname, 'lambdas/index'),
      lambdaHandler: 'handler',
      envfile: path.join(__dirname, '.env'),
      event: event
    })
      // Respond to HTTP request
  res
  .status(result.statusCode)
  .end(result.body)
  })

app.listen(3000, () => console.log('listening on port: 3000'));

async function convertRequestToApiGatewayEvent(req) {
    let claims = {};
    if (req.headers.authorization) {
      claims = jwt(req.headers.authorization.replace('bearer ', ''));
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