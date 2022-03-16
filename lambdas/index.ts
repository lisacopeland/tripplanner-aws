import { Trip } from './trips';

export const handler = async (event): Promise<any> => {
  console.log('querystring: ', event.queryStringParameters);
  const queryString = event.queryStringParameters;
  const method = event.requestContext.http.method;
  const account_id = queryString.account_id;
  const id = queryString.id;
  const body = event.body;
  console.log('method is ', method);

  switch (method) {
    case 'GET':
      if (account_id !== undefined) {
        const trips = await Trip.query(account_id, id);
        return { statusCode: 200, body: trips };
      } else {
        return { statusCode: 500, body: `Account Id is required` };
      }
    case 'POST':
      const trip = Trip.newInstance(body);
      await trip.save();
      return { statusCode: 200, body: trip };
    case 'PUT':
      const trips = await Trip.query(account_id, id);
      if (!trips.length) {
        return { statusCode: 500, body: `Couldnt find existing trip` };
      }
      const putTrip = trips[0];
      Object.keys(body).forEach((key) => {
        putTrip[key] = body[key];
      });
      putTrip.save();
      return { statusCode: 200, body: putTrip };
    case 'DELETE':
      const delTrips = await Trip.query(account_id, id);
      if (!delTrips.length) {
        return { statusCode: 500, body: `Couldnt find existing trip` };
      }
      const delTrip = delTrips[0];
      delTrip.delete();
      return { statusCode: 200, body: delTrip };
    default:
      return { statusCode: 500, body: 'Unsupported method' };
  }
};
