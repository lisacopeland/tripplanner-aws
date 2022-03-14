import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import moment from "moment";

const TABLE_NAME = process.env.TABLE_NAME || "trips";

const documentClient = new AWS.DynamoDB.DocumentClient();

import { DocumentClient } from "aws-sdk/clients/dynamodb";

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

  static async query(accountId: string, id?: string): Promise<Trip[]> {
    const TableName = TABLE_NAME;
    const params: DocumentClient.QueryInput = {
      TableName,
    };
    if (id !== undefined) {
      params.KeyConditionExpression = "pk = :pk and sk = :sk";
      params.ExpressionAttributeValues = {
        ":pk": `${accountId}`,
        ":sk": `${id}`,
      };
    } else {
      params.KeyConditionExpression = "pk = :pk and begins_with(sk,:sk)";
      params.ExpressionAttributeValues = {
        ":pk": `${accountId}`,
        ":sk": `trip!`,
      };
    }
    try {
      const res = await documentClient.query(params).promise();

      if (res.Items) {
        const results = res.Items.map((item) => {
          return this.newInstance(item);
        });
        return results;
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  }

  async save(): Promise<Trip> {
    const TableName = TABLE_NAME;
    try {
      await documentClient
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
      await documentClient
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
      this.id = `Trip!${newId}`;
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
export function mapToTrips(data: any[]): Trip[] {
  return data.map(mapToTrip);
}
