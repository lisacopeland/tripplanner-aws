import { mapToPeople, Person } from './people';
import { mapToTripDetails, mapToTrips, Trip, TripDetail } from './trips';

// headers: {
//  "Access-Control-Allow-Origin": "*",  // I was missing this
//    "Content-Type": "application/json"   // and this
// }
export interface LambdaResponse {
  statusCode: number;
  headers: any;
  body: string; 
}

export const handler = async (event): Promise<any> => {
  console.log('querystring: ', event.queryStringParameters);
  const queryString = event.queryStringParameters;
  const method = event.requestContext.httpMethod;
  const aid = event.pathParameters.aid;
  const personId = event.pathParameters.personId;
  const tripId = event.pathParameters.tripId;
  const tripDetailId = event.pathParameters.tripdetailId
  const body = event.body;
  console.log('aid is ', aid, 'personId is ', personId, 'tripId is ', tripId, 'method is ', method);
  const dataType = getDataType(event.path);

  switch (dataType) {
    case 'trips': 
      return await tripOperation(method, aid, tripId, queryString, body);
    case 'people':
      return await peopleOperation(method, aid, personId, queryString, body);
    case 'tripdetails':
      return await tripDetailOperation(method, tripId, tripDetailId, queryString, body);
    default: 
      return errorResponse(500, `Something went wrong`);
  }
};

async function tripOperation(method: string, aid: string, tripId?: string, queryString?: string, body = {}) {
  try {
    if (method === 'POST') {
      const trip = Trip.newInstance(body);
      await trip.save();
      return successResponse(trip);
    }
    
    const res = await Trip.query(aid, tripId, queryString);
    const trips: Trip[] = mapToTrips(res.Items);
    const trip: Trip = trips[0];

    switch(method) {
      case 'GET': 
        return successResponse(trips);
      case 'PUT':
        Object.keys(body).forEach((key) => {
          trip[key] = body[key];
        });
        await trip.save();
        return successResponse(trip);
      case 'DELETE':
        await trip.delete();
        return successResponse(trip);
      default: 
        return errorResponse(500, `Unsupported method: ${method}`);
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
      return successResponse(tripDetail);
    }

    const res = await TripDetail.query(tripId, tripDetailId, queryString);
    const tripDetails: TripDetail[] = mapToTripDetails(res.Items);

    switch (method) {
      case 'GET':
        return successResponse(tripDetails);
      case 'PUT':
        const tripDetail: TripDetail = tripDetails[0];
        if (tripDetail !== undefined) {
          Object.keys(body).forEach((key) => {
            tripDetail[key] = body[key];
          });
          await tripDetail.save();
          return successResponse(tripDetail);
        }
      case 'DELETE':
        const tripDelete: TripDetail = tripDetails[0];
        await tripDelete.delete();
        return successResponse(tripDelete);
      default:
        return errorResponse(500, `Unsupported method: ${method}` );
    }
  } catch (e) {
    throw e;
  }

}

async function peopleOperation(method: string, aid: string, personId?: string, queryString?: string, body = {}) {

  try {
    if (method === 'POST') {
      const person = Person.newInstance(body);
      await person.save();
      return successResponse(person);
    }

    const res = await Person.query(aid, personId, queryString);
    const persons: Person[] = mapToPeople(res.Items);
    const person: Person = persons[0];

    switch (method) {
      case 'GET':
        return successResponse(persons);
      case 'PUT':
        Object.keys(body).forEach((key) => {
          person[key] = body[key];
        });
        await person.save();
        return successResponse(person);
      case 'DELETE':
        await person.delete();
        return successResponse(person);
      default:
        return errorResponse(500, `Unsupported method: ${method}`);
    }
  } catch (e) {
    throw e;
  }

}

function getDataType(path: string): string {
  const pathSections = path.split('/');
  if (pathSections.includes('people')) {
    return 'people';
  }
  if (pathSections.includes('tripdetails')) {
    return 'tripdetails';
  } else {
    return 'trips';
  }
}

function successResponse(data: any) {
  const response: LambdaResponse = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",  // I was missing this
      "Content-Type": "application/json"   // and this
    },
    body: JSON.stringify(data)
  }
  return response;
}

function errorResponse(errorCode: number, message: string) {
  const response: LambdaResponse = {
    statusCode: errorCode,
    headers: {
      "Access-Control-Allow-Origin": "*",  // I was missing this
      "Content-Type": "application/json"   // and this
    },
    body: message
  }
  return response;
}