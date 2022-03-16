"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.ApiLambdaCrudDynamoDBStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
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
        trips.addMethod('PUT', tripsIntegration);
        trips.addMethod('DELETE', tripsIntegration);
        // addCorsOptions(trips);
        const trip = trips.addResource('{id}');
        trip.addMethod('GET', tripsIntegration);
        trip.addMethod('POST', tripsIntegration);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBeUg7QUFDekgsMkRBQWdFO0FBQ2hFLHVEQUFpRDtBQUNqRCw2Q0FBd0Q7QUFDeEQscUVBQW9GO0FBRXBGLE1BQWEsMEJBQTJCLFNBQVEsbUJBQUs7SUFDakQsWUFBWSxHQUFRLEVBQUUsRUFBVTtRQUM1QixLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWYsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDekMsWUFBWSxFQUFFO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDN0I7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUM3QjtZQUNELFNBQVMsRUFBRSxPQUFPO1lBRWxCOzs7O2VBSUc7WUFDSCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3ZDLENBQUMsQ0FBQztRQUVILE1BQU0sbUJBQW1CLEdBQXdCO1lBQzdDLFFBQVEsRUFBRTtnQkFDTixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsZUFBZSxFQUFFO29CQUNiLFNBQVM7aUJBQ1o7YUFDSjtZQUNELG1EQUFtRDtZQUNuRCxXQUFXLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUzthQUNwQztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQTtRQUVELDJEQUEyRDtRQUMzRCxNQUFNLFdBQVcsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN4RCxLQUFLLEVBQUUsb0JBQW9CO1lBQzNCLEdBQUcsbUJBQW1C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Y2UsIExhbWJkYUludGVncmF0aW9uLCBNb2NrSW50ZWdyYXRpb24sIFBhc3N0aHJvdWdoQmVoYXZpb3IsIFJlc3RBcGkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XHJcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcclxuaW1wb3J0IHsgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBOb2RlanNGdW5jdGlvbiwgTm9kZWpzRnVuY3Rpb25Qcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlMYW1iZGFDcnVkRHluYW1vREJTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR5bmFtb1RhYmxlID0gbmV3IFRhYmxlKHRoaXMsICd0cmlwcycsIHtcclxuICAgICAgICAgICAgcGFydGl0aW9uS2V5OiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncGsnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc29ydEtleToge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRhYmxlTmFtZTogJ3RyaXBzJyxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiAgVGhlIGRlZmF1bHQgcmVtb3ZhbCBwb2xpY3kgaXMgUkVUQUlOLCB3aGljaCBtZWFucyB0aGF0IGNkayBkZXN0cm95IHdpbGwgbm90IGF0dGVtcHQgdG8gZGVsZXRlXHJcbiAgICAgICAgICAgICAqIHRoZSBuZXcgdGFibGUsIGFuZCBpdCB3aWxsIHJlbWFpbiBpbiB5b3VyIGFjY291bnQgdW50aWwgbWFudWFsbHkgZGVsZXRlZC4gQnkgc2V0dGluZyB0aGUgcG9saWN5IHRvXHJcbiAgICAgICAgICAgICAqIERFU1RST1ksIGNkayBkZXN0cm95IHdpbGwgZGVsZXRlIHRoZSB0YWJsZSAoZXZlbiBpZiBpdCBoYXMgZGF0YSBpbiBpdClcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gTk9UIHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIGNvZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgbm9kZUpzRnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcclxuICAgICAgICAgICAgYnVuZGxpbmc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ25vZGUxNCcsXHJcbiAgICAgICAgICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYXdzLXNkaycsIC8vIFVzZSB0aGUgJ2F3cy1zZGsnIGF2YWlsYWJsZSBpbiB0aGUgTGFtYmRhIHJ1bnRpbWVcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGRlcHNMb2NrRmlsZVBhdGg6ICcuL2xhbWJkYXMvcGFja2FnZS1sb2NrLmpzb24nLFxyXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgICAgICAgICAgUFJJTUFSWV9LRVk6ICdwaycsXHJcbiAgICAgICAgICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgTGFtYmRhIGZ1bmN0aW9uIGZvciBlYWNoIG9mIHRoZSBDUlVEIG9wZXJhdGlvbnNcclxuICAgICAgICBjb25zdCB0cmlwc0xhbWJkYSA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAndHJpcHNMYW1iZGEnLCB7XHJcbiAgICAgICAgICAgIGVudHJ5OiAnLi9sYW1iZGFzL2luZGV4LnRzJyxcclxuICAgICAgICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR3JhbnQgdGhlIExhbWJkYSBmdW5jdGlvbiByZWFkIGFjY2VzcyB0byB0aGUgRHluYW1vREIgdGFibGVcclxuICAgICAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEodHJpcHNMYW1iZGEpO1xyXG5cclxuICAgICAgICAvLyBJbnRlZ3JhdGUgdGhlIExhbWJkYSBmdW5jdGlvbnMgd2l0aCB0aGUgQVBJIEdhdGV3YXkgcmVzb3VyY2VcclxuICAgICAgICBjb25zdCB0cmlwc0ludGVncmF0aW9uID0gbmV3IExhbWJkYUludGVncmF0aW9uKHRyaXBzTGFtYmRhKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGFuIEFQSSBHYXRld2F5IHJlc291cmNlIGZvciBlYWNoIG9mIHRoZSBDUlVEIG9wZXJhdGlvbnNcclxuICAgICAgICBjb25zdCBhcGkgPSBuZXcgUmVzdEFwaSh0aGlzLCAndHJpcHNBcGknLCB7XHJcbiAgICAgICAgICAgIHJlc3RBcGlOYW1lOiAnVHJpcHMgU2VydmljZScsXHJcbiAgICAgICAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3dIZWFkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1gtQW16LURhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAnWC1BcGktS2V5JyxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbGxvd01ldGhvZHM6IFsnT1BUSU9OUycsICdHRVQnLCAnUE9TVCcsICdQVVQnLCAnUEFUQ0gnLCAnREVMRVRFJ10sXHJcbiAgICAgICAgICAgICAgICBhbGxvd0NyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBbJyonXSxcclxuICAgICAgICAgICAgfSwgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdHJpcHMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndHJpcHMnKTtcclxuICAgICAgICB0cmlwcy5hZGRNZXRob2QoJ0dFVCcsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIHRyaXBzLmFkZE1ldGhvZCgnUE9TVCcsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIHRyaXBzLmFkZE1ldGhvZCgnUFVUJywgdHJpcHNJbnRlZ3JhdGlvbik7XHJcbiAgICAgICAgdHJpcHMuYWRkTWV0aG9kKCdERUxFVEUnLCB0cmlwc0ludGVncmF0aW9uKTsgICAgICAgIFxyXG4gICAgICAgIC8vIGFkZENvcnNPcHRpb25zKHRyaXBzKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzLmFkZFJlc291cmNlKCd7aWR9Jyk7XHJcbiAgICAgICAgdHJpcC5hZGRNZXRob2QoJ0dFVCcsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIHRyaXAuYWRkTWV0aG9kKCdQT1NUJywgdHJpcHNJbnRlZ3JhdGlvbik7ICAgICAgICBcclxuICAgICAgICB0cmlwLmFkZE1ldGhvZCgnUFVUJywgdHJpcHNJbnRlZ3JhdGlvbik7XHJcbiAgICAgICAgdHJpcC5hZGRNZXRob2QoJ0RFTEVURScsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIC8vIGFkZENvcnNPcHRpb25zKHRyaXApOyAgXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IElSZXNvdXJjZSkge1xyXG4gICAgYXBpUmVzb3VyY2UuYWRkTWV0aG9kKCdPUFRJT05TJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XHJcbiAgICAgICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IFt7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogXCInZmFsc2UnXCIsXHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFJ1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXHJcbiAgICAgICAgcmVxdWVzdFRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjogXCJ7XFxcInN0YXR1c0NvZGVcXFwiOiAyMDB9XCJcclxuICAgICAgICB9LFxyXG4gICAgfSksIHtcclxuICAgICAgICBtZXRob2RSZXNwb25zZXM6IFt7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1dXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XHJcbm5ldyBBcGlMYW1iZGFDcnVkRHluYW1vREJTdGFjayhhcHAsICdBcGlMYW1iZGFDcnVkRHluYW1vREJFeGFtcGxlJyk7XHJcbmFwcC5zeW50aCgpOyJdfQ==