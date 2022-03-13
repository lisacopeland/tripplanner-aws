"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.ApiLambdaCrudDynamoDBStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
// import { join } from 'path'
// import * as lambda from 'aws-cdk-lib/aws-lambda';
class ApiLambdaCrudDynamoDBStack extends aws_cdk_lib_1.Stack {
    constructor(app, id) {
        super(app, id);
        const dynamoTable = new aws_dynamodb_1.Table(this, 'trips', {
            partitionKey: {
                name: 'pk',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            sortKey: {
                name: 'sk',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            tableName: 'trips',
            /**
             *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
             * the new table, and it will remain in your account until manually deleted. By setting the policy to
             * DESTROY, cdk destroy will delete the table (even if it has data in it)
             */
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        const nodeJsFunctionProps = {
            bundling: {
                target: 'node14',
                externalModules: [
                    'aws-sdk',
                ],
            },
            // depsLockFilePath: './lambdas/package-lock.json',
            environment: {
                PRIMARY_KEY: 'pk',
                TABLE_NAME: dynamoTable.tableName,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'handler'
        };
        // Create a Lambda function for each of the CRUD operations
        const tripsLambda = new aws_lambda_nodejs_1.NodejsFunction(this, 'tripsLambda', {
            entry: './lambdas/index.ts',
            ...nodeJsFunctionProps,
        });
        /*         const tripsLambda = new lambda.Function(this, 'MyFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    handler: 'index.handler',
                    code: lambda.Code.fromAsset('lambdas'),
                    bundling: {
        
                    }
                });
         */
        // Grant the Lambda function read access to the DynamoDB table
        dynamoTable.grantReadWriteData(tripsLambda);
        // Integrate the Lambda functions with the API Gateway resource
        const tripsIntegration = new aws_apigateway_1.LambdaIntegration(tripsLambda);
        // Create an API Gateway resource for each of the CRUD operations
        const api = new aws_apigateway_1.RestApi(this, 'tripsApi', {
            restApiName: 'Trips Service',
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['*'],
            },
        });
        const trips = api.root.addResource('trips');
        trips.addMethod('GET', tripsIntegration);
        trips.addMethod('POST', tripsIntegration);
        // addCorsOptions(trips);
        const trip = trips.addResource('{id}');
        trip.addMethod('GET', tripsIntegration);
        trip.addMethod('PUT', tripsIntegration);
        trip.addMethod('DELETE', tripsIntegration);
        // addCorsOptions(trip);
    }
}
exports.ApiLambdaCrudDynamoDBStack = ApiLambdaCrudDynamoDBStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new aws_apigateway_1.MockIntegration({
        integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            }],
        passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        },
    }), {
        methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Credentials': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                },
            }]
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new aws_cdk_lib_1.App();
new ApiLambdaCrudDynamoDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBeUg7QUFDekgsMkRBQWdFO0FBQ2hFLHVEQUFpRDtBQUNqRCw2Q0FBd0Q7QUFDeEQscUVBQW9GO0FBQ3BGLDhCQUE4QjtBQUM5QixvREFBb0Q7QUFFcEQsTUFBYSwwQkFBMkIsU0FBUSxtQkFBSztJQUNqRCxZQUFZLEdBQVEsRUFBRSxFQUFVO1FBQzVCLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFZixNQUFNLFdBQVcsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN6QyxZQUFZLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUM3QjtZQUNELE9BQU8sRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzdCO1lBQ0QsU0FBUyxFQUFFLE9BQU87WUFFbEI7Ozs7ZUFJRztZQUNILGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDdkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxtQkFBbUIsR0FBd0I7WUFDN0MsUUFBUSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixlQUFlLEVBQUU7b0JBQ2IsU0FBUztpQkFDWjthQUNKO1lBQ0QsbURBQW1EO1lBQ25ELFdBQVcsRUFBRTtnQkFDVCxXQUFXLEVBQUUsSUFBSTtnQkFDakIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxTQUFTO2FBQ3BDO1lBQ0QsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztZQUM1QixPQUFPLEVBQUUsU0FBUztTQUNyQixDQUFBO1FBRUQsMkRBQTJEO1FBQzNELE1BQU0sV0FBVyxHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3hELEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsR0FBRyxtQkFBbUI7U0FDekIsQ0FBQyxDQUFDO1FBRVg7Ozs7Ozs7O1dBUUc7UUFDSyw4REFBOEQ7UUFDOUQsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLCtEQUErRDtRQUMvRCxNQUFNLGdCQUFnQixHQUFHLElBQUksa0NBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFNUQsaUVBQWlFO1FBQ2pFLE1BQU0sR0FBRyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLDJCQUEyQixFQUFFO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1YsY0FBYztvQkFDZCxZQUFZO29CQUNaLGVBQWU7b0JBQ2YsV0FBVztpQkFDZDtnQkFDRCxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztnQkFDbEUsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO2FBQ3RCO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN6QyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFDLHlCQUF5QjtRQUV6QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLHdCQUF3QjtJQUU1QixDQUFDO0NBQ0o7QUF4RkQsZ0VBd0ZDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFdBQXNCO0lBQ2pELFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksZ0NBQWUsQ0FBQztRQUNqRCxvQkFBb0IsRUFBRSxDQUFDO2dCQUNuQixVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2hCLHFEQUFxRCxFQUFFLHlGQUF5RjtvQkFDaEosb0RBQW9ELEVBQUUsS0FBSztvQkFDM0QseURBQXlELEVBQUUsU0FBUztvQkFDcEUscURBQXFELEVBQUUsK0JBQStCO2lCQUN6RjthQUNKLENBQUM7UUFDRixtQkFBbUIsRUFBRSxvQ0FBbUIsQ0FBQyxLQUFLO1FBQzlDLGdCQUFnQixFQUFFO1lBQ2Qsa0JBQWtCLEVBQUUsdUJBQXVCO1NBQzlDO0tBQ0osQ0FBQyxFQUFFO1FBQ0EsZUFBZSxFQUFFLENBQUM7Z0JBQ2QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNoQixxREFBcUQsRUFBRSxJQUFJO29CQUMzRCxxREFBcUQsRUFBRSxJQUFJO29CQUMzRCx5REFBeUQsRUFBRSxJQUFJO29CQUMvRCxvREFBb0QsRUFBRSxJQUFJO2lCQUM3RDthQUNKLENBQUM7S0FDTCxDQUFDLENBQUE7QUFDTixDQUFDO0FBMUJELHdDQTBCQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksMEJBQTBCLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7QUFDcEUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBMYW1iZGFJbnRlZ3JhdGlvbiwgTW9ja0ludGVncmF0aW9uLCBQYXNzdGhyb3VnaEJlaGF2aW9yLCBSZXN0QXBpIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBUYWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XHJcbmltcG9ydCB7IFJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcclxuaW1wb3J0IHsgQXBwLCBTdGFjaywgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgTm9kZWpzRnVuY3Rpb24sIE5vZGVqc0Z1bmN0aW9uUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XHJcbi8vIGltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xyXG4vLyBpbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpTGFtYmRhQ3J1ZER5bmFtb0RCU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGFwcCwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBkeW5hbW9UYWJsZSA9IG5ldyBUYWJsZSh0aGlzLCAndHJpcHMnLCB7XHJcbiAgICAgICAgICAgIHBhcnRpdGlvbktleToge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3BrJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNvcnRLZXk6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzaycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0YWJsZU5hbWU6ICd0cmlwcycsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxyXG4gICAgICAgICAgICAgKiB0aGUgbmV3IHRhYmxlLCBhbmQgaXQgd2lsbCByZW1haW4gaW4geW91ciBhY2NvdW50IHVudGlsIG1hbnVhbGx5IGRlbGV0ZWQuIEJ5IHNldHRpbmcgdGhlIHBvbGljeSB0b1xyXG4gICAgICAgICAgICAgKiBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGRlbGV0ZSB0aGUgdGFibGUgKGV2ZW4gaWYgaXQgaGFzIGRhdGEgaW4gaXQpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIGJ1bmRsaW5nOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdub2RlMTQnLFxyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2F3cy1zZGsnLCAvLyBVc2UgdGhlICdhd3Mtc2RrJyBhdmFpbGFibGUgaW4gdGhlIExhbWJkYSBydW50aW1lXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBkZXBzTG9ja0ZpbGVQYXRoOiAnLi9sYW1iZGFzL3BhY2thZ2UtbG9jay5qc29uJyxcclxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIFBSSU1BUllfS0VZOiAncGsnLFxyXG4gICAgICAgICAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiAnaGFuZGxlcidcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIExhbWJkYSBmdW5jdGlvbiBmb3IgZWFjaCBvZiB0aGUgQ1JVRCBvcGVyYXRpb25zXHJcbiAgICAgICAgY29uc3QgdHJpcHNMYW1iZGEgPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ3RyaXBzTGFtYmRhJywge1xyXG4gICAgICAgICAgICBlbnRyeTogJy4vbGFtYmRhcy9pbmRleC50cycsXHJcbiAgICAgICAgICAgIC4uLm5vZGVKc0Z1bmN0aW9uUHJvcHMsXHJcbiAgICAgICAgfSk7XHJcblxyXG4vKiAgICAgICAgIGNvbnN0IHRyaXBzTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTXlGdW5jdGlvbicsIHtcclxuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGFzJyksXHJcbiAgICAgICAgICAgIGJ1bmRsaW5nOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAqL1xyXG4gICAgICAgIC8vIEdyYW50IHRoZSBMYW1iZGEgZnVuY3Rpb24gcmVhZCBhY2Nlc3MgdG8gdGhlIER5bmFtb0RCIHRhYmxlXHJcbiAgICAgICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHRyaXBzTGFtYmRhKTtcclxuXHJcbiAgICAgICAgLy8gSW50ZWdyYXRlIHRoZSBMYW1iZGEgZnVuY3Rpb25zIHdpdGggdGhlIEFQSSBHYXRld2F5IHJlc291cmNlXHJcbiAgICAgICAgY29uc3QgdHJpcHNJbnRlZ3JhdGlvbiA9IG5ldyBMYW1iZGFJbnRlZ3JhdGlvbih0cmlwc0xhbWJkYSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhbiBBUEkgR2F0ZXdheSByZXNvdXJjZSBmb3IgZWFjaCBvZiB0aGUgQ1JVRCBvcGVyYXRpb25zXHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IFJlc3RBcGkodGhpcywgJ3RyaXBzQXBpJywge1xyXG4gICAgICAgICAgICByZXN0QXBpTmFtZTogJ1RyaXBzIFNlcnZpY2UnLFxyXG4gICAgICAgICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93SGVhZGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICdYLUFtei1EYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1gtQXBpLUtleScsXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBbJ09QVElPTlMnLCAnR0VUJywgJ1BPU1QnLCAnUFVUJywgJ1BBVENIJywgJ0RFTEVURSddLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFsbG93T3JpZ2luczogWycqJ10sXHJcbiAgICAgICAgICAgIH0sICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyaXBzID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3RyaXBzJyk7XHJcbiAgICAgICAgdHJpcHMuYWRkTWV0aG9kKCdHRVQnLCB0cmlwc0ludGVncmF0aW9uKTtcclxuICAgICAgICB0cmlwcy5hZGRNZXRob2QoJ1BPU1QnLCB0cmlwc0ludGVncmF0aW9uKTtcclxuICAgICAgICAvLyBhZGRDb3JzT3B0aW9ucyh0cmlwcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcy5hZGRSZXNvdXJjZSgne2lkfScpO1xyXG4gICAgICAgIHRyaXAuYWRkTWV0aG9kKCdHRVQnLCB0cmlwc0ludGVncmF0aW9uKTtcclxuICAgICAgICB0cmlwLmFkZE1ldGhvZCgnUFVUJywgdHJpcHNJbnRlZ3JhdGlvbik7XHJcbiAgICAgICAgdHJpcC5hZGRNZXRob2QoJ0RFTEVURScsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIC8vIGFkZENvcnNPcHRpb25zKHRyaXApO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvcnNPcHRpb25zKGFwaVJlc291cmNlOiBJUmVzb3VyY2UpIHtcclxuICAgIGFwaVJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xyXG4gICAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogXCInQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4sWC1BbXotVXNlci1BZ2VudCdcIixcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJyonXCIsXHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IFwiJ2ZhbHNlJ1wiLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSdcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XSxcclxuICAgICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBQYXNzdGhyb3VnaEJlaGF2aW9yLk5FVkVSLFxyXG4gICAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IFwie1xcXCJzdGF0dXNDb2RlXFxcIjogMjAwfVwiXHJcbiAgICAgICAgfSxcclxuICAgIH0pLCB7XHJcbiAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xyXG5uZXcgQXBpTGFtYmRhQ3J1ZER5bmFtb0RCU3RhY2soYXBwLCAnQXBpTGFtYmRhQ3J1ZER5bmFtb0RCRXhhbXBsZScpO1xyXG5hcHAuc3ludGgoKTsiXX0=