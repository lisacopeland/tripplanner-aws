"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.ApiLambdaCrudDynamoDBStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
class ApiLambdaCrudDynamoDBStack extends aws_cdk_lib_1.Stack {
    constructor(app, id) {
        var _a;
        super(app, id);
        const tableName = process.env.TABLE_NAME || 'trips';
        const bucketName = process.env.BACKGROUND_PIC_BUCKET_NAME || 'background-picture-bucket';
        const dynamoTable = new aws_dynamodb_1.Table(this, tableName, {
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
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.RETAIN,
        });
        const bucket = new aws_s3_1.Bucket(this, bucketName);
        (_a = bucket.policy) === null || _a === void 0 ? void 0 : _a.applyRemovalPolicy(aws_cdk_lib_1.RemovalPolicy.RETAIN);
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
        bucket.grantReadWrite(tripsLambda);
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
        trips.addMethod('GET', tripsIntegration); // Query for trips
        trips.addMethod('POST', tripsIntegration); // Post a new trip
        // trips.addMethod('PUT', tripsIntegration);
        // trips.addMethod('DELETE', tripsIntegration);        
        // addCorsOptions(trips);
        const trip = trips.addResource('{id}');
        trip.addMethod('GET', tripsIntegration); // Get a specific trip
        // trip.addMethod('POST', tripsIntegration);        
        trip.addMethod('PUT', tripsIntegration); // Update a trip
        trip.addMethod('DELETE', tripsIntegration); // Delete a trip
        // addCorsOptions(trip);  
        const tripDetails = api.root.addResource('tripdetails');
        tripDetails.addMethod('GET', tripsIntegration); // Query for trip details
        tripDetails.addMethod('POST', tripsIntegration); // Post a new trip detail
        const tripDetail = tripDetails.addResource('{id}');
        tripDetail.addMethod('PUT', tripsIntegration); // Update a trip
        tripDetail.addMethod('DELETE', tripsIntegration); // Delete a trip
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBeUg7QUFDekgsMkRBQWdFO0FBQ2hFLHVEQUFpRDtBQUNqRCw2Q0FBd0Q7QUFDeEQscUVBQW9GO0FBQ3BGLCtDQUE0QztBQUU1QyxNQUFhLDBCQUEyQixTQUFRLG1CQUFLO0lBQ2pELFlBQVksR0FBUSxFQUFFLEVBQVU7O1FBQzVCLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFZixNQUFNLFNBQVMsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7UUFDNUQsTUFBTSxVQUFVLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsSUFBSSwyQkFBMkIsQ0FBQztRQUNqRyxNQUFNLFdBQVcsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMzQyxZQUFZLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUM3QjtZQUNELE9BQU8sRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzdCO1lBQ0QsU0FBUyxFQUFFLE9BQU87WUFFbEI7Ozs7ZUFJRztZQUNILGFBQWEsRUFBRSwyQkFBYSxDQUFDLE1BQU07U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLE1BQUEsTUFBTSxDQUFDLE1BQU0sMENBQUUsa0JBQWtCLENBQUMsMkJBQWEsQ0FBQyxNQUFNLEVBQUU7UUFFeEQsTUFBTSxtQkFBbUIsR0FBd0I7WUFDN0MsUUFBUSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixlQUFlLEVBQUU7b0JBQ2IsU0FBUztpQkFD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Q0FBQztnQkFDbkIsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNoQixxREFBcUQsRUFBRSx5RkFBeUY7b0JBQ2hKLG9EQUFvRCxFQUFFLEtBQUs7b0JBQzNELHlEQUF5RCxFQUFFLFNBQVM7b0JBQ3BFLHFEQUFxRCxFQUFFLCtCQUErQjtpQkFDekY7YUFDSixDQUFDO1FBQ0YsbUJBQW1CLEVBQUUsb0NBQW1CLENBQUMsS0FBSztRQUM5QyxnQkFBZ0IsRUFBRTtZQUNkLGtCQUFrQixFQUFFLHVCQUF1QjtTQUM5QztLQUNKLENBQUMsRUFBRTtRQUNBLGVBQWUsRUFBRSxDQUFDO2dCQUNkLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRTtvQkFDaEIscURBQXFELEVBQUUsSUFBSTtvQkFDM0QscURBQXFELEVBQUUsSUFBSTtvQkFDM0QseURBQXlELEVBQUUsSUFBSTtvQkFDL0Qsb0RBQW9ELEVBQUUsSUFBSTtpQkFDN0Q7YUFDSixDQUFDO0tBQ0wsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQTFCRCx3Q0EwQkM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLDBCQUEwQixDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3BFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgTGFtYmRhSW50ZWdyYXRpb24sIE1vY2tJbnRlZ3JhdGlvbiwgUGFzc3Rocm91Z2hCZWhhdmlvciwgUmVzdEFwaSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcclxuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xyXG5pbXBvcnQgeyBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IE5vZGVqc0Z1bmN0aW9uLCBOb2RlanNGdW5jdGlvblByb3BzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanMnO1xyXG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUxhbWJkYUNydWREeW5hbW9EQlN0YWNrIGV4dGVuZHMgU3RhY2sge1xyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihhcHAsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGFibGVOYW1lOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIHx8ICd0cmlwcyc7XHJcbiAgICAgICAgY29uc3QgYnVja2V0TmFtZTogc3RyaW5nID0gcHJvY2Vzcy5lbnYuQkFDS0dST1VORF9QSUNfQlVDS0VUX05BTUUgfHwgJ2JhY2tncm91bmQtcGljdHVyZS1idWNrZXQnO1xyXG4gICAgICAgIGNvbnN0IGR5bmFtb1RhYmxlID0gbmV3IFRhYmxlKHRoaXMsIHRhYmxlTmFtZSwge1xyXG4gICAgICAgICAgICBwYXJ0aXRpb25LZXk6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdwaycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3J0S2V5OiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2snLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGFibGVOYW1lOiAndHJpcHMnLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqICBUaGUgZGVmYXVsdCByZW1vdmFsIHBvbGljeSBpcyBSRVRBSU4sIHdoaWNoIG1lYW5zIHRoYXQgY2RrIGRlc3Ryb3kgd2lsbCBub3QgYXR0ZW1wdCB0byBkZWxldGVcclxuICAgICAgICAgICAgICogdGhlIG5ldyB0YWJsZSwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cclxuICAgICAgICAgICAgICogREVTVFJPWSwgY2RrIGRlc3Ryb3kgd2lsbCBkZWxldGUgdGhlIHRhYmxlIChldmVuIGlmIGl0IGhhcyBkYXRhIGluIGl0KVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgYnVja2V0TmFtZSk7XHJcbiAgICAgICAgYnVja2V0LnBvbGljeT8uYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOKTtcclxuXHJcbiAgICAgICAgY29uc3Qgbm9kZUpzRnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcclxuICAgICAgICAgICAgYnVuZGxpbmc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ25vZGUxNCcsXHJcbiAgICAgICAgICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYXdzLXNkaycsIC8vIFVzZSB0aGUgJ2F3cy1zZGsnIGF2YWlsYWJsZSBpbiB0aGUgTGFtYmRhIHJ1bnRpbWVcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGRlcHNMb2NrRmlsZVBhdGg6ICcuL2xhbWJkYXMvcGFja2FnZS1sb2NrLmpzb24nLFxyXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgICAgICAgICAgUFJJTUFSWV9LRVk6ICdwaycsXHJcbiAgICAgICAgICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgTGFtYmRhIGZ1bmN0aW9uIGZvciBlYWNoIG9mIHRoZSBDUlVEIG9wZXJhdGlvbnNcclxuICAgICAgICBjb25zdCB0cmlwc0xhbWJkYSA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAndHJpcHNMYW1iZGEnLCB7XHJcbiAgICAgICAgICAgIGVudHJ5OiAnLi9sYW1iZGFzL2luZGV4LnRzJyxcclxuICAgICAgICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR3JhbnQgdGhlIExhbWJkYSBmdW5jdGlvbiByZWFkIGFjY2VzcyB0byB0aGUgRHluYW1vREIgdGFibGVcclxuICAgICAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEodHJpcHNMYW1iZGEpO1xyXG4gICAgICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZSh0cmlwc0xhbWJkYSk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIC8vIEludGVncmF0ZSB0aGUgTGFtYmRhIGZ1bmN0aW9ucyB3aXRoIHRoZSBBUEkgR2F0ZXdheSByZXNvdXJjZVxyXG4gICAgICAgIGNvbnN0IHRyaXBzSW50ZWdyYXRpb24gPSBuZXcgTGFtYmRhSW50ZWdyYXRpb24odHJpcHNMYW1iZGEpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYW4gQVBJIEdhdGV3YXkgcmVzb3VyY2UgZm9yIGVhY2ggb2YgdGhlIENSVUQgb3BlcmF0aW9uc1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICd0cmlwc0FwaScsIHtcclxuICAgICAgICAgICAgcmVzdEFwaU5hbWU6ICdUcmlwcyBTZXJ2aWNlJyxcclxuICAgICAgICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvd0hlYWRlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJyxcclxuICAgICAgICAgICAgICAgICAgICAnWC1BbXotRGF0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICdYLUFwaS1LZXknLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGFsbG93TWV0aG9kczogWydPUFRJT05TJywgJ0dFVCcsICdQT1NUJywgJ1BVVCcsICdQQVRDSCcsICdERUxFVEUnXSxcclxuICAgICAgICAgICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd09yaWdpbnM6IFsnKiddLFxyXG4gICAgICAgICAgICB9LCAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB0cmlwcyA9IGFwaS5yb290LmFkZFJlc291cmNlKCd0cmlwcycpO1xyXG4gICAgICAgIHRyaXBzLmFkZE1ldGhvZCgnR0VUJywgdHJpcHNJbnRlZ3JhdGlvbik7IC8vIFF1ZXJ5IGZvciB0cmlwc1xyXG4gICAgICAgIHRyaXBzLmFkZE1ldGhvZCgnUE9TVCcsIHRyaXBzSW50ZWdyYXRpb24pOyAvLyBQb3N0IGEgbmV3IHRyaXBcclxuICAgICAgICAvLyB0cmlwcy5hZGRNZXRob2QoJ1BVVCcsIHRyaXBzSW50ZWdyYXRpb24pO1xyXG4gICAgICAgIC8vIHRyaXBzLmFkZE1ldGhvZCgnREVMRVRFJywgdHJpcHNJbnRlZ3JhdGlvbik7ICAgICAgICBcclxuICAgICAgICAvLyBhZGRDb3JzT3B0aW9ucyh0cmlwcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcy5hZGRSZXNvdXJjZSgne2lkfScpO1xyXG4gICAgICAgIHRyaXAuYWRkTWV0aG9kKCdHRVQnLCB0cmlwc0ludGVncmF0aW9uKTsgLy8gR2V0IGEgc3BlY2lmaWMgdHJpcFxyXG4gICAgICAgIC8vIHRyaXAuYWRkTWV0aG9kKCdQT1NUJywgdHJpcHNJbnRlZ3JhdGlvbik7ICAgICAgICBcclxuICAgICAgICB0cmlwLmFkZE1ldGhvZCgnUFVUJywgdHJpcHNJbnRlZ3JhdGlvbik7ICAvLyBVcGRhdGUgYSB0cmlwXHJcbiAgICAgICAgdHJpcC5hZGRNZXRob2QoJ0RFTEVURScsIHRyaXBzSW50ZWdyYXRpb24pOyAvLyBEZWxldGUgYSB0cmlwXHJcbiAgICAgICAgLy8gYWRkQ29yc09wdGlvbnModHJpcCk7ICBcclxuXHJcbiAgICAgICAgY29uc3QgdHJpcERldGFpbHMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndHJpcGRldGFpbHMnKTtcclxuICAgICAgICB0cmlwRGV0YWlscy5hZGRNZXRob2QoJ0dFVCcsIHRyaXBzSW50ZWdyYXRpb24pOyAvLyBRdWVyeSBmb3IgdHJpcCBkZXRhaWxzXHJcbiAgICAgICAgdHJpcERldGFpbHMuYWRkTWV0aG9kKCdQT1NUJywgdHJpcHNJbnRlZ3JhdGlvbik7IC8vIFBvc3QgYSBuZXcgdHJpcCBkZXRhaWxcclxuXHJcbiAgICAgICAgY29uc3QgdHJpcERldGFpbCA9IHRyaXBEZXRhaWxzLmFkZFJlc291cmNlKCd7aWR9Jyk7XHJcbiAgICAgICAgdHJpcERldGFpbC5hZGRNZXRob2QoJ1BVVCcsIHRyaXBzSW50ZWdyYXRpb24pOyAgLy8gVXBkYXRlIGEgdHJpcFxyXG4gICAgICAgIHRyaXBEZXRhaWwuYWRkTWV0aG9kKCdERUxFVEUnLCB0cmlwc0ludGVncmF0aW9uKTsgLy8gRGVsZXRlIGEgdHJpcFxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvcnNPcHRpb25zKGFwaVJlc291cmNlOiBJUmVzb3VyY2UpIHtcclxuICAgIGFwaVJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xyXG4gICAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogXCInQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4sWC1BbXotVXNlci1BZ2VudCdcIixcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJyonXCIsXHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IFwiJ2ZhbHNlJ1wiLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSdcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XSxcclxuICAgICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBQYXNzdGhyb3VnaEJlaGF2aW9yLk5FVkVSLFxyXG4gICAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IFwie1xcXCJzdGF0dXNDb2RlXFxcIjogMjAwfVwiXHJcbiAgICAgICAgfSxcclxuICAgIH0pLCB7XHJcbiAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xyXG5uZXcgQXBpTGFtYmRhQ3J1ZER5bmFtb0RCU3RhY2soYXBwLCAnQXBpTGFtYmRhQ3J1ZER5bmFtb0RCRXhhbXBsZScpO1xyXG5hcHAuc3ludGgoKTsiXX0=