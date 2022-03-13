import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
// import { join } from 'path'
// import * as lambda from 'aws-cdk-lib/aws-lambda';

export class ApiLambdaCrudDynamoDBStack extends Stack {
    constructor(app: App, id: string) {
        super(app, id);

        const dynamoTable = new Table(this, 'trips', {
            partitionKey: {
                name: 'pk',
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'sk',
                type: AttributeType.STRING
            },
            tableName: 'trips',

            /**
             *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
             * the new table, and it will remain in your account until manually deleted. By setting the policy to
             * DESTROY, cdk destroy will delete the table (even if it has data in it)
             */
            removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
        });

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
                target: 'node14',
                externalModules: [
                    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
                ],
            },
            // depsLockFilePath: './lambdas/package-lock.json',
            environment: {
                PRIMARY_KEY: 'pk',
                TABLE_NAME: dynamoTable.tableName,
            },
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler'
        }

        // Create a Lambda function for each of the CRUD operations
        const tripsLambda = new NodejsFunction(this, 'tripsLambda', {
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
        const tripsIntegration = new LambdaIntegration(tripsLambda);

        // Create an API Gateway resource for each of the CRUD operations
        const api = new RestApi(this, 'tripsApi', {
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
        addCorsOptions(trips);

        const trip = trips.addResource('{id}');
        trip.addMethod('GET', tripsIntegration);
        trip.addMethod('POST', tripsIntegration);        
        trip.addMethod('PUT', tripsIntegration);
        trip.addMethod('DELETE', tripsIntegration);
        addCorsOptions(trip);

    }
}

export function addCorsOptions(apiResource: IResource) {
    apiResource.addMethod('OPTIONS', new MockIntegration({
        integrationResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Credentials': "'false'",
                'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
            },
        }],
        passthroughBehavior: PassthroughBehavior.NEVER,
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
    })
}

const app = new App();
new ApiLambdaCrudDynamoDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.synth();