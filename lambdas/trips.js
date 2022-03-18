"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPeople = exports.mapToPerson = exports.Person = exports.mapToTripDetails = exports.mapToTripDetail = exports.TripDetail = exports.mapToTrips = exports.mapToTrip = exports.Trip = exports.deepCopy = void 0;
const AWS = __importStar(require("aws-sdk"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const TABLE_NAME = process.env.TABLE_NAME || "trips";
const db = new AWS.DynamoDB.DocumentClient();
function deepCopy(o) {
    return JSON.parse(JSON.stringify(o));
}
exports.deepCopy = deepCopy;
class Trip {
    constructor(defaultValues) {
        Object.keys(defaultValues).forEach((key) => {
            this[key] = defaultValues[key];
        });
        if (!this.id) {
            const newId = uuid_1.v4();
            this.id = `trip!${newId}`;
            this.created_at = moment_1.default().format();
        }
    }
    static async query(aid, id) {
        const TableName = TABLE_NAME;
        const params = {
            TableName,
            KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
            ExpressionAttributeValues: {
                ":pk": `${aid}`,
                ":sk": `trip!`,
            }
        };
        if (id !== undefined) {
            params.KeyConditionExpression = "pk = :pk and sk = :sk";
            params.ExpressionAttributeValues = {
                ":pk": `${aid}`,
                ":sk": `${id}`,
            };
        }
        try {
            return await db.query(params).promise();
        }
        catch (dbError) {
            throw dbError;
        }
    }
    async save() {
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
        }
        catch (e) {
            throw e;
        }
    }
    async delete() {
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
        }
        catch (e) {
            throw e;
        }
    }
    static newInstance(data) {
        return new Trip(data);
    }
    clone() {
        return new Trip(deepCopy(this));
    }
}
exports.Trip = Trip;
function mapToTrip(data) {
    return new Trip(data);
}
exports.mapToTrip = mapToTrip;
function mapToTrips(data) {
    if (data !== undefined) {
        return data.map(mapToTrip);
    }
    else {
        return [];
    }
}
exports.mapToTrips = mapToTrips;
class TripDetail {
    constructor(defaultValues) {
        Object.keys(defaultValues).forEach((key) => {
            this[key] = defaultValues[key];
        });
        if (!this.id) {
            const newId = uuid_1.v4();
            this.id = `tripdetail!${newId}`;
            this.created_at = moment_1.default().format();
        }
    }
    static async query(tripId, id) {
        const TableName = TABLE_NAME;
        const params = {
            TableName,
            KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
            ExpressionAttributeValues: {
                ":pk": `${tripId}`,
                ":sk": `tripdetail!`,
            }
        };
        if (id !== undefined) {
            params.KeyConditionExpression = "pk = :pk and sk = :sk";
            params.ExpressionAttributeValues = {
                ":pk": `${tripId}`,
                ":sk": `${id}`,
            };
        }
        try {
            const res = await db.query(params).promise();
            return res;
        }
        catch (dbError) {
            throw dbError;
        }
    }
    async save() {
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
        }
        catch (e) {
            throw e;
        }
    }
    async delete() {
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
        }
        catch (e) {
            throw e;
        }
    }
    static newInstance(data) {
        return new TripDetail(data);
    }
    clone() {
        return new TripDetail(deepCopy(this));
    }
}
exports.TripDetail = TripDetail;
function mapToTripDetail(data) {
    return new TripDetail(data);
}
exports.mapToTripDetail = mapToTripDetail;
function mapToTripDetails(data) {
    if (data !== undefined) {
        return data.map(mapToTripDetail);
    }
    else {
        return [];
    }
}
exports.mapToTripDetails = mapToTripDetails;
class Person {
    constructor(defaultValues) {
        Object.keys(defaultValues).forEach((key) => {
            this[key] = defaultValues[key];
        });
        if (!this.id) {
            this.id = `person!${this.emailAddress}`;
            this.created_at = moment_1.default().format();
        }
    }
    static async query(aid, email) {
        const TableName = TABLE_NAME;
        const params = {
            TableName,
            KeyConditionExpression: "pk = :pk and begins_with(sk,:sk)",
            ExpressionAttributeValues: {
                ":pk": `${aid}`,
                ":sk": `person!`,
            }
        };
        if (email !== undefined) {
            params.KeyConditionExpression = "pk = :pk and sk = :sk";
            params.ExpressionAttributeValues = {
                ":pk": `${aid}`,
                ":sk": `person!${email}`,
            };
        }
        try {
            const res = await db.query(params).promise();
            return res;
        }
        catch (dbError) {
            throw dbError;
        }
    }
    async save() {
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
        }
        catch (e) {
            throw e;
        }
    }
    async delete() {
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
        }
        catch (e) {
            throw e;
        }
    }
    static newInstance(data) {
        return new Person(data);
    }
    clone() {
        return new Person(deepCopy(this));
    }
}
exports.Person = Person;
function mapToPerson(data) {
    return new Person(data);
}
exports.mapToPerson = mapToPerson;
function mapToPeople(data) {
    if (data !== undefined) {
        return data.map(mapToPerson);
    }
    else {
        return [];
    }
}
exports.mapToPeople = mapToPeople;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmlwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLCtCQUFrQztBQUNsQyxvREFBNEI7QUFHNUIsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO0FBRXJELE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUU3QyxTQUFnQixRQUFRLENBQUMsQ0FBTTtJQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQWEsSUFBSTtJQW1GZixZQUFZLGFBQTRCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1osTUFBTSxLQUFLLEdBQUcsU0FBSSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQS9FRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFXLEVBQUUsRUFBVztRQUN6QyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQThCO1lBQ3hDLFNBQVM7WUFDVCxzQkFBc0IsRUFBRSxr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LFNBQVMsRUFBRTtRQUN0QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDOUI7U0FBTTtRQUNMLE9BQU8sRUFBRSxDQUFDO0tBQ1g7QUFDSCxDQUFDO0FBTkQsa0NBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XHJcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5pbXBvcnQgeyBEb2N1bWVudENsaWVudCB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGJcIjtcclxuXHJcbmNvbnN0IFRBQkxFX05BTUUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIHx8IFwidHJpcHNcIjtcclxuXHJcbmNvbnN0IGRiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDb3B5KG86IGFueSk6IGFueSB7XHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpcCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB1cGRhdGVkX2F0OiBzdHJpbmc7XHJcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xyXG4gIGFjY291bnRfaWQ6IHN0cmluZztcclxuICBhZG1pbl90aXRsZTogc3RyaW5nO1xyXG4gIGFkbWluX3N0YXR1czogc3RyaW5nO1xyXG4gIGFkbWluX25vdGVzOiBzdHJpbmc7XHJcbiAgYmFja2dyb3VuZF9waWNfdXJsOiBzdHJpbmc7XHJcbiAgc3RhcnRfZGF0ZTogc3RyaW5nO1xyXG4gIGVuZF9kYXRlOiBzdHJpbmc7XHJcbiAgcGFydGljaXBhbnRzOiBzdHJpbmdbXTsgLy8gRW1haWxzIG9mIHBhcnRpY2lwYW50c1xyXG4gIHRvdGFsVHJpcENvc3Q6IG51bWJlcjtcclxuXHJcbiAgc3RhdGljIGFzeW5jIHF1ZXJ5KGFpZDogc3RyaW5nLCBpZD86IHN0cmluZyk6IFByb21pc2U8RG9jdW1lbnRDbGllbnQuUXVlcnlPdXRwdXQ+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICBjb25zdCBwYXJhbXM6IERvY3VtZW50Q2xpZW50LlF1ZXJ5SW5wdXQgPSB7XHJcbiAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJwayA9IDpwayBhbmQgYmVnaW5zX3dpdGgoc2ssOnNrKVwiLFxyXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XHJcbiAgICAgICAgXCI6cGtcIjogYCR7YWlkfWAsXHJcbiAgICAgICAgXCI6c2tcIjogYHRyaXAhYCxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBwYXJhbXMuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IFwicGsgPSA6cGsgYW5kIHNrID0gOnNrXCI7XHJcbiAgICBwYXJhbXMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IHtcclxuICAgICAgXCI6cGtcIjogYCR7YWlkfWAsXHJcbiAgICAgIFwiOnNrXCI6IGAke2lkfWAsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gYXdhaXQgZGIucXVlcnkocGFyYW1zKS5wcm9taXNlKCk7XHJcbiAgICB9IGNhdGNoIChkYkVycm9yKSB7XHJcbiAgICAgIHRocm93IGRiRXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlKCk6IFByb21pc2U8VHJpcD4ge1xyXG4gICAgY29uc3QgVGFibGVOYW1lID0gVEFCTEVfTkFNRTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGRiXHJcbiAgICAgICAgLnB1dCh7XHJcbiAgICAgICAgICBUYWJsZU5hbWUsXHJcbiAgICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgIHBrOiBgJHt0aGlzLmFjY291bnRfaWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgICAgLi4udGhpcyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBkZWxldGUoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZGJcclxuICAgICAgICAuZGVsZXRlKHtcclxuICAgICAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgICAgIEtleToge1xyXG4gICAgICAgICAgICBwazogYCR7dGhpcy5hY2NvdW50X2lkfWAsXHJcbiAgICAgICAgICAgIHNrOiBgJHt0aGlzLmlkfWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnByb21pc2UoKTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIG5ld0luc3RhbmNlKGRhdGE6IFBhcnRpYWw8VHJpcD4pIHtcclxuICAgIHJldHVybiBuZXcgVHJpcChkYXRhKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZXM6IFBhcnRpYWw8VHJpcD4pIHtcclxuICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdFZhbHVlc1trZXldO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaWQpIHtcclxuICAgICAgY29uc3QgbmV3SWQgPSB1dWlkKCk7XHJcbiAgICAgIHRoaXMuaWQgPSBgdHJpcCEke25ld0lkfWA7XHJcbiAgICAgIHRoaXMuY3JlYXRlZF9hdCA9IG1vbWVudCgpLmZvcm1hdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xvbmUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFRyaXAoZGVlcENvcHkodGhpcykpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvVHJpcChkYXRhOiBhbnkpOiBUcmlwIHtcclxuICByZXR1cm4gbmV3IFRyaXAoZGF0YSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvVHJpcHMoZGF0YTogYW55W10gfCB1bmRlZmluZWQpOiBUcmlwW10ge1xyXG4gIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBkYXRhLm1hcChtYXBUb1RyaXApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpcERldGFpbCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB0cmlwSWQ6IHN0cmluZztcclxuICBlbGVtZW50VHlwZTogc3RyaW5nOyAvLyBUcmFuc3BvcnRhdGlvbiwgQWNjb21vZGF0aW9uLCBBY3Rpdml0eVxyXG4gIHVwZGF0ZWRfYXQ6IHN0cmluZztcclxuICBjcmVhdGVkX2F0OiBzdHJpbmc7XHJcbiAgYWNjb3VudF9pZDogc3RyaW5nO1xyXG4gIGFkbWluX3RpdGxlOiBzdHJpbmc7XHJcbiAgYWRtaW5fc3RhdHVzOiBzdHJpbmc7XHJcbiAgYWRtaW5fbm90ZXM6IHN0cmluZztcclxuICBzdGFydF9kYXRlOiBzdHJpbmc7XHJcbiAgZW5kX2RhdGU6IHN0cmluZztcclxuICBsb2NhdGlvbl9zdGFydDogc3RyaW5nO1xyXG4gIGxvY2F0aW9uX2VuZDogc3RyaW5nO1xyXG4gIHBhcnRpY2lwYW50czogc3RyaW5nW107IC8vIEp1c3QgZ29pbmcgdG8ga2VlcCBlbWFpbHNcclxuICBjb3N0OiBudW1iZXI7XHJcbiAgY29zdFR5cGU6IHN0cmluZzsgLy8gcGVyIGluZGl2aWR1YWwgb3IgdG90YWw/XHJcblxyXG4gIHN0YXRpYyBhc3luYyBxdWVyeSh0cmlwSWQ6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBQcm9taXNlPERvY3VtZW50Q2xpZW50LlF1ZXJ5T3V0cHV0PiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgY29uc3QgcGFyYW1zOiBEb2N1bWVudENsaWVudC5RdWVyeUlucHV0ID0ge1xyXG4gICAgICBUYWJsZU5hbWUsXHJcbiAgICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IFwicGsgPSA6cGsgYW5kIGJlZ2luc193aXRoKHNrLDpzaylcIixcclxuICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xyXG4gICAgICAgIFwiOnBrXCI6IGAke3RyaXBJZH1gLFxyXG4gICAgICAgIFwiOnNrXCI6IGB0cmlwZGV0YWlsIWAsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwYXJhbXMuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IFwicGsgPSA6cGsgYW5kIHNrID0gOnNrXCI7XHJcbiAgICAgIHBhcmFtcy5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzID0ge1xyXG4gICAgICAgIFwiOnBrXCI6IGAke3RyaXBJZH1gLFxyXG4gICAgICAgIFwiOnNrXCI6IGAke2lkfWAsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzOiBEb2N1bWVudENsaWVudC5RdWVyeU91dHB1dCA9IGF3YWl0IGRiLnF1ZXJ5KHBhcmFtcykucHJvbWlzZSgpO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSBjYXRjaCAoZGJFcnJvcikge1xyXG4gICAgICB0aHJvdyBkYkVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZSgpOiBQcm9taXNlPFRyaXBEZXRhaWw+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkYlxyXG4gICAgICAgIC5wdXQoe1xyXG4gICAgICAgICAgVGFibGVOYW1lLFxyXG4gICAgICAgICAgSXRlbToge1xyXG4gICAgICAgICAgICBwazogYCR7dGhpcy50cmlwSWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgICAgLi4udGhpcyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBkZWxldGUoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZGJcclxuICAgICAgICAuZGVsZXRlKHtcclxuICAgICAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgICAgIEtleToge1xyXG4gICAgICAgICAgICBwazogYCR7dGhpcy50cmlwSWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbmV3SW5zdGFuY2UoZGF0YTogUGFydGlhbDxUcmlwRGV0YWlsPikge1xyXG4gICAgcmV0dXJuIG5ldyBUcmlwRGV0YWlsKGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoZGVmYXVsdFZhbHVlczogUGFydGlhbDxUcmlwRGV0YWlsPikge1xyXG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRWYWx1ZXNba2V5XTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdGhpcy5pZCkge1xyXG4gICAgICBjb25zdCBuZXdJZCA9IHV1aWQoKTtcclxuICAgICAgdGhpcy5pZCA9IGB0cmlwZGV0YWlsISR7bmV3SWR9YDtcclxuICAgICAgdGhpcy5jcmVhdGVkX2F0ID0gbW9tZW50KCkuZm9ybWF0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbG9uZSgpIHtcclxuICAgIHJldHVybiBuZXcgVHJpcERldGFpbChkZWVwQ29weSh0aGlzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9UcmlwRGV0YWlsKGRhdGE6IGFueSk6IFRyaXBEZXRhaWwge1xyXG4gIHJldHVybiBuZXcgVHJpcERldGFpbChkYXRhKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9UcmlwRGV0YWlscyhkYXRhOiBhbnlbXSB8IHVuZGVmaW5lZCk6IFRyaXBEZXRhaWxbXSB7XHJcbiAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGRhdGEubWFwKG1hcFRvVHJpcERldGFpbCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQZXJzb24ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdXBkYXRlZF9hdDogc3RyaW5nO1xyXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcclxuICBhY2NvdW50X2lkOiBzdHJpbmc7XHJcbiAgYWRtaW5fdGl0bGU6IHN0cmluZztcclxuICBhZG1pbl9zdGF0dXM6IHN0cmluZztcclxuICBhZG1pbl9ub3Rlczogc3RyaW5nO1xyXG4gIGVtYWlsQWRkcmVzczogc3RyaW5nO1xyXG4gIGJhY2tncm91bmRfcGljX3VybDogc3RyaW5nO1xyXG4gIGJpcnRoRGF0ZTogc3RyaW5nO1xyXG4gIHBhc3Nwb3J0TnVtYmVyOiBzdHJpbmc7XHJcbiAgXHJcbiAgc3RhdGljIGFzeW5jIHF1ZXJ5KGFpZDogc3RyaW5nLCBlbWFpbD86IHN0cmluZyk6IFByb21pc2U8RG9jdW1lbnRDbGllbnQuUXVlcnlPdXRwdXQ+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICBjb25zdCBwYXJhbXM6IERvY3VtZW50Q2xpZW50LlF1ZXJ5SW5wdXQgPSB7XHJcbiAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJwayA9IDpwayBhbmQgYmVnaW5zX3dpdGgoc2ssOnNrKVwiLFxyXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XHJcbiAgICAgICAgXCI6cGtcIjogYCR7YWlkfWAsXHJcbiAgICAgICAgXCI6c2tcIjogYHBlcnNvbiFgLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVtYWlsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcGFyYW1zLktleUNvbmRpdGlvbkV4cHJlc3Npb24gPSBcInBrID0gOnBrIGFuZCBzayA9IDpza1wiO1xyXG4gICAgICBwYXJhbXMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IHtcclxuICAgICAgICBcIjpwa1wiOiBgJHthaWR9YCxcclxuICAgICAgICBcIjpza1wiOiBgcGVyc29uISR7ZW1haWx9YCxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXM6IERvY3VtZW50Q2xpZW50LlF1ZXJ5T3V0cHV0ID0gYXdhaXQgZGIucXVlcnkocGFyYW1zKS5wcm9taXNlKCk7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9IGNhdGNoIChkYkVycm9yKSB7XHJcbiAgICAgIHRocm93IGRiRXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlKCk6IFByb21pc2U8UGVyc29uPiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZGJcclxuICAgICAgICAucHV0KHtcclxuICAgICAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgICAgIEl0ZW06IHtcclxuICAgICAgICAgICAgcGs6IGAke3RoaXMuYWNjb3VudF9pZH1gLFxyXG4gICAgICAgICAgICBzazogYCR7dGhpcy5pZH1gLFxyXG4gICAgICAgICAgICAuLi50aGlzLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5wcm9taXNlKCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGRlbGV0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkYlxyXG4gICAgICAgIC5kZWxldGUoe1xyXG4gICAgICAgICAgVGFibGVOYW1lLFxyXG4gICAgICAgICAgS2V5OiB7XHJcbiAgICAgICAgICAgIHBrOiBgJHt0aGlzLmFjY291bnRfaWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbmV3SW5zdGFuY2UoZGF0YTogUGFydGlhbDxQZXJzb24+KSB7XHJcbiAgICByZXR1cm4gbmV3IFBlcnNvbihkYXRhKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZXM6IFBhcnRpYWw8UGVyc29uPikge1xyXG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRWYWx1ZXNba2V5XTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdGhpcy5pZCkge1xyXG4gICAgICB0aGlzLmlkID0gYHBlcnNvbiEke3RoaXMuZW1haWxBZGRyZXNzfWA7XHJcbiAgICAgIHRoaXMuY3JlYXRlZF9hdCA9IG1vbWVudCgpLmZvcm1hdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xvbmUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFBlcnNvbihkZWVwQ29weSh0aGlzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9QZXJzb24oZGF0YTogYW55KTogUGVyc29uIHtcclxuICByZXR1cm4gbmV3IFBlcnNvbihkYXRhKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9QZW9wbGUoZGF0YTogYW55W10gfCB1bmRlZmluZWQpOiBQZXJzb25bXSB7XHJcbiAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGRhdGEubWFwKG1hcFRvUGVyc29uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufSJdfQ==