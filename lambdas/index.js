"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const trips_1 = require("./trips");
exports.handler = async (event) => {
    // const method = event.requestContext.http.method;
    // const queryString = event.queryStringParameters;
    console.log('got event: ', event);
    console.log('this is the second day of this!');
    try {
        const response = await trips_1.Trip.query('lisa');
        return { statusCode: 200, body: JSON.stringify(response) };
    }
    catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBK0I7QUFFbEIsUUFBQSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBZ0IsRUFBRTtJQUVqRCxtREFBbUQ7SUFDbkQsbURBQW1EO0lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUMvQyxJQUFJO1FBQ0EsTUFBTSxRQUFRLEdBQUcsTUFBTSxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7S0FDOUQ7SUFBQyxPQUFPLE9BQU8sRUFBRTtRQUNkLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7S0FDN0Q7QUFDTCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmlwIH0gZnJvbSAnLi90cmlwcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudCk6IFByb21pc2U8YW55PiA9PiB7XHJcblxyXG4gICAgLy8gY29uc3QgbWV0aG9kID0gZXZlbnQucmVxdWVzdENvbnRleHQuaHR0cC5tZXRob2Q7XHJcbiAgICAvLyBjb25zdCBxdWVyeVN0cmluZyA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycztcclxuICAgIGNvbnNvbGUubG9nKCdnb3QgZXZlbnQ6ICcsIGV2ZW50KTtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZWNvbmQgZGF5IG9mIHRoaXMhJyk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgVHJpcC5xdWVyeSgnbGlzYScpO1xyXG4gICAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpIH07XHJcbiAgICB9IGNhdGNoIChkYkVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShkYkVycm9yKSB9O1xyXG4gICAgfVxyXG59OyJdfQ==