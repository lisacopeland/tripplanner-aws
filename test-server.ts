import path from "path";
import jwt from 'jwt-decode';
const express = require('express')
const lambdaLocal = require('lambda-local');
const cors = require('cors');
const app = express();

const STAGE = 'prod';
process.env.TABLE_NAME = 'trips';
process.env.BACKGROUND_PIC_BUCKET_NAME = 'trips-background-pics';

export const routes = [
  {
    path: '/trips/:aid',
    method: 'GET'
  },
  {
    path: '/trips/:aid',
    method: 'POST'
  },
  {
    path: '/trips/:aid/:tripId',
    method: 'PUT'
  },
  {
    path: '/trips/:aid/:tripId',
    method: 'DELETE'
  },
  {
    path: '/trips/:aid/:tripId/tripdetails',
    method: 'GET'
  },
  {
    path: '/trips/:aid/:tripId/tripdetails',
    method: 'POST'
  },
  {
    path: '/trips/:aid/:tripId/tripdetails/:tripdetailId',
    method: 'PUT'
  },
  {
    path: '/trips/:aid/:tripId/tripdetails/:tripdetailId',
    method: 'DELETE'
  }  
];

// Process body as plain text as this is
// how it would come from API Gateway
app.use(cors());
// app.use(express.text());

app.use(express.json());

routes.forEach((route) => {
  const method = route.method.toLowerCase();
  app[method](
    route.path,
    convertRequestToApiGatewayEvent,
    async (req, res) => {
      console.log('intercepting', route.method, route.path);
      try {
        const result = await lambdaLocal
          .execute({
            lambdaPath: path.join(__dirname, 'lambdas/index'),
            lambdaHandler: 'handler',
            envfile: path.join(__dirname, '.env'),
            event: req.event
          })
        // Respond to HTTP request
        const body = (result.body !== undefined) ? JSON.stringify(result.body) : '';
        if (result.statusCode) {
          res.status(result.statusCode);
        } else {
          res.status(200);
        }
        res.send(body);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  )
})

app.listen(3000, () => console.log('listening on port: 3000'));

async function convertRequestToApiGatewayEvent(req, res, next) {
  let claims = {};
  if (req.headers.authorization) {
    claims = jwt(req.headers.authorization.replace('bearer ', ''));
  }
  const event = {
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
      httpMethod: req.method,
      path: req.path,
      protocol: 'HTTP/1.1',
      requestId: 'id',
      routeKey: STAGE,
      stage: STAGE,
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390,
    },
    body: req.body ? req.body : null,
    pathParameters: req.params,
    isBase64Encoded: false,
    stageVariables: {
      stageVariable1: 'value1',
      stageVariable2: 'value2',
    },
  };
  req.event = event;
  next();
}