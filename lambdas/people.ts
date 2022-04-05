import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// CRUD operations for Persons and PersonDetails
const TABLE_NAME = process.env.TABLE_NAME || "persons";

const db = new AWS.DynamoDB.DocumentClient();

export function deepCopy(o: any): any {
    return JSON.parse(JSON.stringify(o));
}

export class Person {
    id: string;
    account_id: string;
    updated_at: string;
    created_at: string;
    name: string;
    admin_status: string;
    admin_notes: string;
    background_pic_url: string;
    email: string;
    passport_number: string;
    passport_expirydate: string;
    birth_date: string;
    phone_number: string;

    static async query(aid: string, id?: string, queryString?: string): Promise<DocumentClient.QueryOutput> {
        const TableName = TABLE_NAME;
        const params: DocumentClient.QueryInput = {
            TableName,
            KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
            ExpressionAttributeValues: {
                ":pk": `${aid}`,
                ":sk": `person!`,
            }
        }

        console.log('queryString = ', queryString);

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

    async save(): Promise<Person> {
        const TableName = TABLE_NAME;
        try {
            const result = await db
                .put({
                    TableName,
                    Item: {
                        pk: `${this.account_id}`,
                        sk: `${this.id}`,
                        ...this,
                    },
                })
                .promise();
            console.log('got result from put, ', result);
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
            const newId = uuid();
            this.id = `person!${newId}`;
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