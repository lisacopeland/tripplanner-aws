import { mapToTripDetails, mapToTrips, Trip, TripDetail } from './trips';

export const handler = async (event): Promise<any> => {
  console.log('querystring: ', event.queryStringParameters);
  const queryString = event.queryStringParameters;
  const method = event.requestContext.httpMethod;
  const account_id = event.pathParameters.aid;
  const tripId = event.pathParameters.tripId;
  const tripDetailId = event.pathParameters.tripdetailId
  const body = event.body;
  console.log('aid is ', account_id, 'tripId is ', tripId, 'method is ', method);
  const dataType = getDataType(event.rawPath);
  if (dataType === 'trips') {
    const res = tripOperation(method, account_id, tripId, queryString, body);
    console.log('res from trip op ', res);
    return res;
  } else {
    console.log('this is a tripdetail operation');
    return tripDetailOperation(method, tripId, tripDetailId, queryString, body)
  }

};

async function tripOperation(method: string, aid: string, tripId?: string, queryString?: string, body = {}) {
  try {
    if (method === 'POST') {
      const trip = Trip.newInstance(body);
      await trip.save();
      return { statusCode: 200, body: trip };
    }
    
    const res = await Trip.query(aid, tripId, queryString);
    const trips: Trip[] = mapToTrips(res.Items);
    const trip: Trip = trips[0];

    switch(method) {
      case 'GET': 
        return { statusCode: 200, body: trips };
      case 'PUT':
        Object.keys(body).forEach((key) => {
          trip[key] = body[key];
        });
        await trip.save();
        return { statusCode: 200, body: trip };
      case 'DELETE':
        await trip.delete();
        return { statusCode: 200, body: trip };
      default: 
        return { statusCode: 500, body: `Unsupported method: ${method}`}
    }
  } catch (e) {
    throw e;
  }

}

async function tripDetailOperation(method: string, tripId: string, tripDetailId?: string, queryString?: string, body = {}) {

  try {
    if (method === 'POST') {
      const tripDetail = TripDetail.newInstance(body);
      await tripDetail.save();
      return { statusCode: 200, body: tripDetail };
    }

    const res = await TripDetail.query(tripId, tripDetailId, queryString);
    const tripDetails: TripDetail[] = mapToTripDetails(res.Items);

    switch (method) {
      case 'GET':
        return { statusCode: 200, body: tripDetails };
      case 'PUT':
        const tripDetail: TripDetail = tripDetails[0];
        if (tripDetail !== undefined) {
          Object.keys(body).forEach((key) => {
            tripDetail[key] = body[key];
          });
          await tripDetail.save();
          return { statusCode: 200, body: tripDetail };
        }
      case 'DELETE':
        const tripDelete: TripDetail = tripDetails[0];
        await tripDelete.delete();
        return { statusCode: 200, body: tripDelete };
      default:
        return { statusCode: 500, body: `Unsupported method: ${method}` }
    }
  } catch (e) {
    throw e;
  }

}

function getDataType(path: string): string {
  const pathSections = path.split('/');
  if (pathSections.includes('tripdetails')) {
    return 'tripdetails';
  } else {
    return 'trips';
  }
}
