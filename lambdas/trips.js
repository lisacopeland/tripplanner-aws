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
const documentClient = new AWS.DynamoDB.DocumentClient();
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
    static async query(accountId, id) {
        const TableName = TABLE_NAME;
        const params = {
            TableName,
        };
        if (id !== undefined) {
            params.KeyConditionExpression = "pk = :pk and sk = :sk";
            params.ExpressionAttributeValues = {
                ":pk": `${accountId}`,
                ":sk": `${id}`,
            };
        }
        else {
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
            }
            else {
                return [];
            }
        }
        catch (e) {
            throw e;
        }
    }
    async save() {
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
        }
        catch (e) {
            throw e;
        }
    }
    async delete() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmlwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLCtCQUFrQztBQUNsQyxvREFBNEI7QUFFNUIsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO0FBRXJELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUl6RCxTQUFnQixRQUFRLENBQUMsQ0FBTTtJQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQWEsSUFBSTtJQXNGZixZQUFZLGFBQTRCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1osTUFBTSxLQUFLLEdBQUcsU0FBSSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQXZGRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFpQixFQUFFLEVBQVc7UUFDL0MsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBQzdCLE1BQU0sTUFBTSxHQUE4QjtZQUN4QyxTQUFTO1NBQ1YsQ0FBQztRQUNGLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNwQixNQUFNLENBQUMsc0JBQXNCLEdBQUcsdUJBQXVCLENBQUM7WUFDeEQsTUFBTSxDQUFDLHlCQUF5QixHQUFHO2dCQUNqQyxLQUFLLEVBQUUsR0FBRyxTQUFTLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTthQUNmLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxDQUFDLHNCQUFzQixHQUFHLGtDQUFrQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyx5QkFBeUIsR0FBRztnQkFDakMsS0FBSyxFQUFFLEdBQUcsU0FBUyxFQUFFO2dCQUNyQixLQUFLLEVBQUUsT0FBTzthQUNmLENBQUM7U0FDSDtRQUNELElBQUk7WUFDRixNQUFNLEdBQUcsR0FBRyxNQUFNLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFekQsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNiLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3JDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxPQUFPLENBQUM7YUFDaEI7aUJBQU07Z0JBQ0wsT0FBTyxFQUFFLENBQUM7YUFDWDtTQUNGO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLENBQUMsQ0FBQztTQUNUO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUk7WUFDRixNQUFNLGNBQWM7aUJBQ2pCLEdBQUcsQ0FBQztnQkFDSCxTQUFTO2dCQUNULElBQUksRUFBRTtvQkFDSixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUN4QixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFO29CQUNoQixHQUFHLElBQUk7aUJBQ1I7YUFDRixDQUFDO2lCQUNELE9BQU8sRUFBRSxDQUFDO1lBRWIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLENBQUM7U0FDVDtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNWLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJO1lBQ0YsTUFBTSxjQUFjO2lCQUNqQixNQUFNLENBQUM7Z0JBQ04sU0FBUztnQkFDVCxHQUFHLEVBQUU7b0JBQ0gsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDeEIsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRTtpQkFDakI7YUFDRixDQUFDO2lCQUNELE9BQU8sRUFBRSxDQUFDO1lBRWIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLENBQUM7U0FDVDtJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQW1CO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQWNELEtBQUs7UUFDSCxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRjtBQXJHRCxvQkFxR0M7QUFFRCxTQUFnQixTQUFTLENBQUMsSUFBUztJQUNqQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCw4QkFFQztBQUNELFNBQWdCLFVBQVUsQ0FBQyxJQUFXO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRkQsZ0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XHJcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5cclxuY29uc3QgVEFCTEVfTkFNRSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgfHwgXCJ0cmlwc1wiO1xyXG5cclxuY29uc3QgZG9jdW1lbnRDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XHJcblxyXG5pbXBvcnQgeyBEb2N1bWVudENsaWVudCB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ29weShvOiBhbnkpOiBhbnkge1xyXG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaXAge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdXBkYXRlZF9hdDogc3RyaW5nO1xyXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcclxuICBhY2NvdW50X2lkOiBzdHJpbmc7XHJcbiAgYWRtaW5fdGl0bGU6IHN0cmluZztcclxuICBhZG1pbl9zdGF0dXM6IHN0cmluZztcclxuICBhZG1pbl9ub3Rlczogc3RyaW5nO1xyXG5cclxuICBzdGF0aWMgYXN5bmMgcXVlcnkoYWNjb3VudElkOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxUcmlwW10+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICBjb25zdCBwYXJhbXM6IERvY3VtZW50Q2xpZW50LlF1ZXJ5SW5wdXQgPSB7XHJcbiAgICAgIFRhYmxlTmFtZSxcclxuICAgIH07XHJcbiAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwYXJhbXMuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IFwicGsgPSA6cGsgYW5kIHNrID0gOnNrXCI7XHJcbiAgICAgIHBhcmFtcy5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzID0ge1xyXG4gICAgICAgIFwiOnBrXCI6IGAke2FjY291bnRJZH1gLFxyXG4gICAgICAgIFwiOnNrXCI6IGAke2lkfWAsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYXJhbXMuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IFwicGsgPSA6cGsgYW5kIGJlZ2luc193aXRoKHNrLDpzaylcIjtcclxuICAgICAgcGFyYW1zLkV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMgPSB7XHJcbiAgICAgICAgXCI6cGtcIjogYCR7YWNjb3VudElkfWAsXHJcbiAgICAgICAgXCI6c2tcIjogYHRyaXAhYCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGRvY3VtZW50Q2xpZW50LnF1ZXJ5KHBhcmFtcykucHJvbWlzZSgpO1xyXG5cclxuICAgICAgaWYgKHJlcy5JdGVtcykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXMuSXRlbXMubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5uZXdJbnN0YW5jZShpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmUoKTogUHJvbWlzZTxUcmlwPiB7XHJcbiAgICBjb25zdCBUYWJsZU5hbWUgPSBUQUJMRV9OQU1FO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZG9jdW1lbnRDbGllbnRcclxuICAgICAgICAucHV0KHtcclxuICAgICAgICAgIFRhYmxlTmFtZSxcclxuICAgICAgICAgIEl0ZW06IHtcclxuICAgICAgICAgICAgcGs6IGAke3RoaXMuYWNjb3VudF9pZH1gLFxyXG4gICAgICAgICAgICBzazogYCR7dGhpcy5pZH1gLFxyXG4gICAgICAgICAgICAuLi50aGlzLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5wcm9taXNlKCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGRlbGV0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IFRhYmxlTmFtZSA9IFRBQkxFX05BTUU7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkb2N1bWVudENsaWVudFxyXG4gICAgICAgIC5kZWxldGUoe1xyXG4gICAgICAgICAgVGFibGVOYW1lLFxyXG4gICAgICAgICAgS2V5OiB7XHJcbiAgICAgICAgICAgIHBrOiBgJHt0aGlzLmFjY291bnRfaWR9YCxcclxuICAgICAgICAgICAgc2s6IGAke3RoaXMuaWR9YCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJvbWlzZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbmV3SW5zdGFuY2UoZGF0YTogUGFydGlhbDxUcmlwPikge1xyXG4gICAgcmV0dXJuIG5ldyBUcmlwKGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoZGVmYXVsdFZhbHVlczogUGFydGlhbDxUcmlwPikge1xyXG4gICAgICBPYmplY3Qua2V5cyhkZWZhdWx0VmFsdWVzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0VmFsdWVzW2tleV07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmICghdGhpcy5pZCkge1xyXG4gICAgICBjb25zdCBuZXdJZCA9IHV1aWQoKTtcclxuICAgICAgdGhpcy5pZCA9IGBUcmlwISR7bmV3SWR9YDtcclxuICAgICAgdGhpcy5jcmVhdGVkX2F0ID0gbW9tZW50KCkuZm9ybWF0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbG9uZSgpIHtcclxuICAgIHJldHVybiBuZXcgVHJpcChkZWVwQ29weSh0aGlzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9UcmlwKGRhdGE6IGFueSk6IFRyaXAge1xyXG4gIHJldHVybiBuZXcgVHJpcChkYXRhKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9UcmlwcyhkYXRhOiBhbnlbXSk6IFRyaXBbXSB7XHJcbiAgcmV0dXJuIGRhdGEubWFwKG1hcFRvVHJpcCk7XHJcbn1cclxuIl19