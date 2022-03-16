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
exports.mapToTrips = exports.mapToTrip = exports.Trip = exports.deepCopy = void 0;
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
            this.id = `Trip!${newId}`;
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
            const response = await db.query(params).promise();
            let items = [];
            if (response.Items) {
                items = response.Items.map((item) => {
                    return this.newInstance(item);
                });
            }
            return { statusCode: 200, body: JSON.stringify(items) };
        }
        catch (dbError) {
            return { statusCode: 500, body: JSON.stringify(dbError) };
        }
        /*     try {
              const res = await documentClient.scan(params).promise();
        
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
            } */
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
    return data.map(mapToTrip);
}
exports.mapToTrips = mapToTrips;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmlwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLCtCQUFrQztBQUNsQyxvREFBNEI7QUFHNUIsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO0FBRXJELE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUU3QyxTQUFnQixRQUFRLENBQUMsQ0FBTTtJQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQWEsSUFBSTtJQW9HZixZQUFZLGFBQTRCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1osTUFBTSxLQUFLLEdBQUcsU0FBSSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQXJHRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFXLEVBQUUsRUFBVztRQUN6QyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQThCO1lBQ3hDLFNBQVM7WUFDVCxzQkFBc0IsRUFBRSxr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RkQsZ0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XHJcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5pbXBvcnQgeyBEb2N1bWVudENsaWVudCB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGJcIjtcclxuXHJcbmNvbnN0IFRBQkxFX05BTUUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIHx8IFwidHJpcHNcIjtcclxuXHJcbmNvbnN0IGRiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDb3B5KG86IGFueSk6IGFueSB7XHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpcCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB1cGRhdGVkX2F0OiBzdHJpbmc7XHJcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xyXG4gIGFjY291bnRfaWQ6IHN0cmluZztcclxuICBhZG1pbl90aXRsZTogc3RyaW5nO1xyXG4gIGFkbWluX3N0YXR1czogc3RyaW5nO1xyXG4gIGFkbWluX25vdGVzOiBzdHJpbmc7XHJcblxyXG4gIHN0YXRpYyBhc3luYyBxdWVyeShhaWQ6IHN0cmluZywgaWQ/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICBjb25zdCBwYXJhbXM6IERvY3VtZW50Q2xpZW50LlF1ZXJ5SW5wdXQgPSB7XHJcbiAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJwayA9IDpwayBhbmQgYmVnaW5zX3dpdGgoc2ssOnNrKVwiLFxyXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XHJcbiAgICAgICAgXCI6cGtcIjogYCR7YWlkfWAsXHJcbiAgICAgICAgXCI6c2tcIjogYHRyaXAhYCxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBwYXJhbXMuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IFwicGsgPSA6cGsgYW5kIHNrID0gOnNrXCI7XHJcbiAgICBwYXJhbXMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IHtcclxuICAgICAgXCI6cGtcIjogYCR7YWlkfWAsXHJcbiAgICAgIFwiOnNrXCI6IGAke2lkfWAsXHJcbiAgICB9O1xyXG4gIH0gXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkYi5xdWVyeShwYXJhbXMpLnByb21pc2UoKTtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmlwW10gPSBbXTtcclxuICAgICAgaWYgKHJlc3BvbnNlLkl0ZW1zKSB7XHJcbiAgICAgICAgaXRlbXMgPSByZXNwb25zZS5JdGVtcy5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLm5ld0luc3RhbmNlKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogMjAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShpdGVtcykgfTtcclxuICAgICAgICBcclxuICAgIH0gY2F0Y2ggKGRiRXJyb3IpIHtcclxuICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShkYkVycm9yKSB9O1xyXG4gICAgfVxyXG4vKiAgICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZG9jdW1lbnRDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcclxuXHJcbiAgICAgIGlmIChyZXMuSXRlbXMpIHtcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzLkl0ZW1zLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMubmV3SW5zdGFuY2UoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9ICovXHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlKCk6IFByb21pc2U8VHJpcD4ge1xyXG4gICAgY29uc3QgVGFibGVOYW1lID0gVEFCTEVfTkFNRTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGRiXHJcbiAgICAgICAgLnB1dCh7XHJcbiAgICAgICAgICBUYWJsZU5hbWUsXHJcbiAgICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgIHBrOiBgJHt0aGlzLmFjY291bnRfaWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgICAgLi4udGhpcyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBkZWxldGUoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZGJcclxuICAgICAgICAuZGVsZXRlKHtcclxuICAgICAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgICAgIEtleToge1xyXG4gICAgICAgICAgICBwazogYCR7dGhpcy5hY2NvdW50X2lkfWAsXHJcbiAgICAgICAgICAgIHNrOiBgJHt0aGlzLmlkfWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnByb21pc2UoKTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIG5ld0luc3RhbmNlKGRhdGE6IFBhcnRpYWw8VHJpcD4pIHtcclxuICAgIHJldHVybiBuZXcgVHJpcChkYXRhKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZXM6IFBhcnRpYWw8VHJpcD4pIHtcclxuICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdFZhbHVlc1trZXldO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaWQpIHtcclxuICAgICAgY29uc3QgbmV3SWQgPSB1dWlkKCk7XHJcbiAgICAgIHRoaXMuaWQgPSBgVHJpcCEke25ld0lkfWA7XHJcbiAgICAgIHRoaXMuY3JlYXRlZF9hdCA9IG1vbWVudCgpLmZvcm1hdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xvbmUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFRyaXAoZGVlcENvcHkodGhpcykpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvVHJpcChkYXRhOiBhbnkpOiBUcmlwIHtcclxuICByZXR1cm4gbmV3IFRyaXAoZGF0YSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvVHJpcHMoZGF0YTogYW55W10pOiBUcmlwW10ge1xyXG4gIHJldHVybiBkYXRhLm1hcChtYXBUb1RyaXApO1xyXG59XHJcbiJdfQ==