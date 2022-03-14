import { Trip } from './trips';

export const handler = async (event): Promise<any> => {

    const method = event.requestContext.http.method;
    const queryString = event.queryStringParameters;

    console.log('this is the second day of this!');
    try {
        const response = await Trip.query(queryString);
        return { statusCode: 200, body: JSON.stringify(response) };
    } catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};