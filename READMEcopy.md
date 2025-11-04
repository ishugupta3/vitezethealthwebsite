# ZetHealth API Documentation for Contact Us and Partner With Us

## Base URL
```
https://apihealth.zethealth.com/api/v1/Authenticate/
```

## Contact Us API

### Endpoint
```
POST /contact-us
```

### Full URL
```
https://apihealth.zethealth.com/api/v1/Authenticate/contact-us
```

### Request Body (JSON)
```json
{
  "name": "string",
  "number": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "type": "contactus"
}
```

### Example Request Body
```json
{
  "name": "John Doe",
  "number": "9876543210",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services.",
  "type": "contactus"
}
```

### Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token> (if logged in)
```

## Partner With Us API

### Endpoint
```
POST /contact-us
```

### Full URL
```
https://apihealth.zethealth.com/api/v1/Authenticate/contact-us
```

### Request Body (JSON)
```json
{
  "name": "string",
  "number": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "type": "partnerwithus"
}
```

### Example Request Body
```json
{
  "name": "Jane Smith",
  "number": "9876543210",
  "email": "jane@company.com",
  "subject": "Partnership Opportunity",
  "message": "We are interested in partnering with ZetHealth.",
  "type": "partnerwithus"
}
```

### Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token> (if logged in)
```

## Postman Testing

### Step 1: Create New Request
1. Open Postman
2. Click "New" → "HTTP Request"
3. Set method to POST

### Step 2: Enter URL
```
https://apihealth.zethealth.com/api/v1/Authenticate/contact-us
```

### Step 3: Set Headers
- Key: `Content-Type`, Value: `application/json`
- Key: `Accept`, Value: `application/json`
- (Optional) Key: `Authorization`, Value: `Bearer <your_token>`

### Step 4: Set Body
- Select "raw" and "JSON"
- Copy the example JSON above
- Modify the values as needed

### Step 5: Send Request
- Click "Send"
- Check the response

## Response Format

### Success Response
```json
{
  "status": true,
  "message": "Message sent successfully"
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message here"
}
```

## Notes
- Both Contact Us and Partner With Us use the same endpoint but different `type` values
- Authentication is optional - the API works for both logged in and anonymous users
- All fields are required for successful submission
- Mobile number should be 10 digits
- Email should be valid email format
