import { LambdaIntegration , RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class ApiLambdaCrudDynamoDBStack extends Stack {
    constructor(app: App, id: string) {
        super(app, id);

        const tableName: string = process.env.TABLE_NAME || 'trips';
        const bucketName: string = process.env.BACKGROUND_PIC_BUCKET_NAME || 'background-picture-bucket';
        const stage: string = process.env.STAGE || 'dev';
        const dynamoTable = new Table(this, tableName, {
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
            removalPolicy: RemovalPolicy.RETAIN, // NOT recommended for production code
        });

        const bucket = new Bucket(this, bucketName);
        bucket.policy?.applyRemovalPolicy(RemovalPolicy.RETAIN);

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
                target: 'node14',
                externalModules: [
                    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
                ],
            },
            // depsLockFilePath: './lambdas/package-lock.json',
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                BACKGROUND_PIC_BUCKET_NAME: bucket.bucketName
            },
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler'
        }

        // Create a Lambda function for each of the CRUD operations
        const tripsLambda = new NodejsFunction(this, 'tripsLambda', {
            entry: './lambdas/index.ts',
            ...nodeJsFunctionProps,
        });

        // Grant the Lambda function read access to the DynamoDB table
        dynamoTable.grantReadWriteData(tripsLambda);
        bucket.grantReadWrite(tripsLambda);
         
        // Integrate the Lambda functions with the API Gateway resource
        const tripsIntegration = new LambdaIntegration(tripsLambda);

        // Create an API Gateway resource for each of the CRUD operations
        const api = new RestApi(this, 'tripsApi', {
            restApiName: 'Trips Service',
            deployOptions: {
              stageName: stage
            },
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

        const aid = api.root.addResource('{aid}');
        const trips = aid.addResource('trips');
        trips.addMethod('GET', tripsIntegration); // Query for trips
        trips.addMethod('POST', tripsIntegration); // Post a new trip

        const tripsId = trips.addResource('{tripId}');
        tripsId.addMethod('GET', tripsIntegration); // Get a specific trip
        tripsId.addMethod('PUT', tripsIntegration);  // Update a trip
        tripsId.addMethod('DELETE', tripsIntegration); // Delete a trip

        const tripDetails = tripsId.addResource('tripdetails');
        tripDetails.addMethod('GET', tripsIntegration); // Query for trip details
        tripDetails.addMethod('POST', tripsIntegration); // Post a new trip detail

        const tripDetailsId = tripDetails.addResource('{tripdetailId}');
        tripDetailsId.addMethod('PUT', tripsIntegration);  // Update a trip
        tripDetailsId.addMethod('DELETE', tripsIntegration); // Delete a trip

        const people = aid.addResource('people');
        people.addMethod('GET', tripsIntegration); // Query for trips
        people.addMethod('POST', tripsIntegration); // Post a new trip

        const personId = people.addResource('{personId}');
        personId.addMethod('GET', tripsIntegration); // Get a specific trip
        personId.addMethod('PUT', tripsIntegration);  // Update a trip
        personId.addMethod('DELETE', tripsIntegration); // Delete a trip

    }
}

const app = new App();
new ApiLambdaCrudDynamoDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.synth();