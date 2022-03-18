import { mapToTrips, Trip } from './trips';

export const handler = async (event): Promise<any> => {
  console.log('querystring: ', event.queryStringParameters);
  const queryString = event.queryStringParameters;
  const method = event.requestContext.http.method;
  const account_id = queryString.account_id;
  const id = queryString.id;
  const body = event.body;
  console.log('method is ', method);
  return tripOperation(method, account_id, id, body);

};

async function tripOperation(method: string, aid: string, id?: string, body = {}) {
  try {
    if (method === 'POST') {
      const trip = Trip.newInstance(body);
      await trip.save();
      return { statusCode: 200, body: trip };
    }
    const res = await Trip.query(aid, id);
    const trips: Trip[] = mapToTrips(res.Items);
    const trip: Trip = trips[0];

    switch(method) {
      case 'GET': 
        return { statusCode: 200, body: trips };
      case 'PUT':
        Object.keys(body).forEach((key) => {
          trip[key] = body[key];
        });
        trip.save();
        return { statusCode: 200, body: trip };
      case 'DELETE':
        trip.delete();
        return { statusCode: 200, body: trip };
      default: 
        return { statusCode: 500, body: `Unsupported method: ${method}`}
    }
  } catch (e) {
    throw e;
  }

}

