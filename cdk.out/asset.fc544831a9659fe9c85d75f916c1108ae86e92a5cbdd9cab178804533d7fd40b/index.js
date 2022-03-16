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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = __importStar(require("aws-sdk"));
const TABLE_NAME = process.env.TABLE_NAME || '';
const db = new AWS.DynamoDB.DocumentClient();
const handler = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    try {
        const response = await db.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(response.Items) };
    }
    catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBRS9CLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztBQUVoRCxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFFdEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFrQixFQUFFO0lBRTVDLE1BQU0sTUFBTSxHQUFHO1FBQ1gsU0FBUyxFQUFFLFVBQVU7S0FDeEIsQ0FBQztJQUVGLElBQUk7UUFDQSxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7S0FDcEU7SUFBQyxPQUFPLE9BQU8sRUFBRTtRQUNkLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7S0FDN0Q7QUFDTCxDQUFDLENBQUM7QUFaVyxRQUFBLE9BQU8sV0FZbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XHJcblxyXG5jb25zdCBUQUJMRV9OQU1FID0gcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSB8fCAnJztcclxuXHJcbmNvbnN0IGRiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiBUQUJMRV9OQU1FXHJcbiAgICB9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkYi5zY2FuKHBhcmFtcykucHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuSXRlbXMpIH07XHJcbiAgICB9IGNhdGNoIChkYkVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShkYkVycm9yKSB9O1xyXG4gICAgfVxyXG59OyJdfQ==