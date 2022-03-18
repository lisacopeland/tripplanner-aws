import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const TABLE_NAME = process.env.TABLE_NAME || "trips";

const db = new AWS.DynamoDB.DocumentClient();

export function deepCopy(o: any): any {
  return JSON.parse(JSON.stringify(o));
}

export class Trip {
  id: string;
  updated_at: string;
  created_at: string;
  account_id: string;
  admin_title: string;
  admin_status: string;
  admin_notes: string;
  background_pic_url: string;
  start_date: string;
  end_date: string;
  participants: string[]; // Emails of participants
  totalTripCost: number;

  static async query(aid: string, id?: string): Promise<DocumentClient.QueryOutput> {
    const TableName = TABLE_NAME;
    const params: DocumentClient.QueryInput = {
      TableName,
      KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
      ExpressionAttributeValues: {
        ":pk": `${aid}`,
        ":sk": `trip!`,
    }
  }

  if (id !== undefined) {
    params.KeyConditionExpression = "pk = :pk and sk = :sk";
    params.ExpressionAttributeValues = {
      ":pk": `${aid}`,
      ":sk": `${id}`,
    };
  }

    try {
      return await db.query(params).promise();
    } catch (dbError) {
      throw dbError;
    }
  }

  async save(): Promise<Trip> {
    const TableName = TABLE_NAME;
    try {
      await db
        .put({
          TableName,
          Item: {
            pk: `${this.account_id}`,
            sk: `${this.id}`,
            ...this,
          },
        })
        .promise();

      return this;
    } catch (e) {
      throw e;
    }
  }

  async delete(): Promise<boolean> {
    const TableName = TABLE_NAME;
    try {
      await db
        .delete({
          TableName,
          Key: {
            pk: `${this.account_id}`,
            sk: `${this.id}`,
          },
        })
        .promise();

      return true;
    } catch (e) {
      throw e;
    }
  }

  static newInstance(data: Partial<Trip>) {
    return new Trip(data);
  }

  constructor(defaultValues: Partial<Trip>) {
      Object.keys(defaultValues).forEach((key) => {
        this[key] = defaultValues[key];
      });

    if (!this.id) {
      const newId = uuid();
      this.id = `trip!${newId}`;
      this.created_at = moment().format();
    }
  }

  clone() {
    return new Trip(deepCopy(this));
  }
}

export function mapToTrip(data: any): Trip {
  return new Trip(data);
}
export function mapToTrips(data: any[] | undefined): Trip[] {
  if (data !== undefined) {
    return data.map(mapToTrip);
  } else {
    return [];
  }
}

export class TripDetail {
  id: string;
  tripId: string;
  elementType: string; // Transportation, Accomodation, Activity
  updated_at: string;
  created_at: string;
  account_id: string;
  admin_title: string;
  admin_status: string;
  admin_notes: string;
  start_date: string;
  end_date: string;
  location_start: string;
  location_end: string;
  participants: string[]; // Just going to keep emails
  cost: number;
  costType: string; // per individual or total?

  static async query(tripId: string, id?: string): Promise<DocumentClient.QueryOutput> {
    const TableName = TABLE_NAME;
    const params: DocumentClient.QueryInput = {
      TableName,
      KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
      ExpressionAttributeValues: {
        ":pk": `${tripId}`,
        ":sk": `tripdetail!`,
      }
    }

    if (id !== undefined) {
      params.KeyConditionExpression = "pk = :pk and sk = :sk";
      params.ExpressionAttributeValues = {
        ":pk": `${tripId}`,
        ":sk": `${id}`,
      };
    }

    try {
      const res: DocumentClient.QueryOutput = await db.query(params).promise();
      return res;
    } catch (dbError) {
      throw dbError;
    }
  }

  async save(): Promise<TripDetail> {
    const TableName = TABLE_NAME;
    try {
      await db
        .put({
          TableName,
          Item: {
            pk: `${this.tripId}`,
            sk: `${this.id}`,
            ...this,
          },
        })
        .promise();

      return this;
    } catch (e) {
      throw e;
    }
  }

  async delete(): Promise<boolean> {
    const TableName = TABLE_NAME;
    try {
      await db
        .delete({
          TableName,
          Key: {
            pk: `${this.tripId}`,
            sk: `${this.id}`,
          },
        })
        .promise();

      return true;
    } catch (e) {
      throw e;
    }
  }

  static newInstance(data: Partial<TripDetail>) {
    return new TripDetail(data);
  }

  constructor(defaultValues: Partial<TripDetail>) {
    Object.keys(defaultValues).forEach((key) => {
      this[key] = defaultValues[key];
    });

    if (!this.id) {
      const newId = uuid();
      this.id = `tripdetail!${newId}`;
      this.created_at = moment().format();
    }
  }

  clone() {
    return new TripDetail(deepCopy(this));
  }
}

export function mapToTripDetail(data: any): TripDetail {
  return new TripDetail(data);
}
export function mapToTripDetails(data: any[] | undefined): TripDetail[] {
  if (data !== undefined) {
    return data.map(mapToTripDetail);
  } else {
    return [];
  }
}

export class Person {
  id: string;
  updated_at: string;
  created_at: string;
  account_id: string;
  admin_title: string;
  admin_status: string;
  admin_notes: string;
  emailAddress: string;
  background_pic_url: string;
  birthDate: string;
  passportNumber: string;
  
  static async query(aid: string, email?: string): Promise<DocumentClient.QueryOutput> {
    const TableName = TABLE_NAME;
    const params: DocumentClient.QueryInput = {
      TableName,
      KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
      ExpressionAttributeValues: {
        ":pk": `${aid}`,
        ":sk": `person!`,
      }
    }

    if (email !== undefined) {
      params.KeyConditionExpression = "pk = :pk and sk = :sk";
      params.ExpressionAttributeValues = {
        ":pk": `${aid}`,
        ":sk": `person!${email}`,
      };
    }

    try {
      const res: DocumentClient.QueryOutput = await db.query(params).promise();
      return res;
    } catch (dbError) {
      throw dbError;
    }
  }

  async save(): Promise<Person> {
    const TableName = TABLE_NAME;
    try {
      await db
        .put({
          TableName,
          Item: {
            pk: `${this.account_id}`,
            sk: `${this.id}`,
            ...this,
          },
        })
        .promise();

      return this;
    } catch (e) {
      throw e;
    }
  }

  async delete(): Promise<boolean> {
    const TableName = TABLE_NAME;
    try {
      await db
        .delete({
          TableName,
          Key: {
            pk: `${this.account_id}`,
            sk: `${this.id}`,
          },
        })
        .promise();

      return true;
    } catch (e) {
      throw e;
    }
  }

  static newInstance(data: Partial<Person>) {
    return new Person(data);
  }

  constructor(defaultValues: Partial<Person>) {
    Object.keys(defaultValues).forEach((key) => {
      this[key] = defaultValues[key];
    });

    if (!this.id) {
      this.id = `person!${this.emailAddress}`;
      this.created_at = moment().format();
    }
  }

  clone() {
    return new Person(deepCopy(this));
  }
}

export function mapToPerson(data: any): Person {
  return new Person(data);
}
export function mapToPeople(data: any[] | undefined): Person[] {
  if (data !== undefined) {
    return data.map(mapToPerson);
  } else {
    return [];
  }
}