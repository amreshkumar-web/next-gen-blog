

---

 **GET /accessQueue/RegistrationQueue**  
Retrieves all queue data. Only **owners** have access to this endpoint. Unauthorized users will receive an **Access Denied** response.  

 **Request**  
- **Method:** `GET`  
- **Endpoint:** `/accessQueue/RegistrationQueue`  
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  

 **Response**  

**Success (200 OK)**  
If the user is the **owner**, the response will contain queue data:  
```json
{
  "status": "success",
  "data": [
    {
      "email": "user1@example.com",
      "date": "2024-02-28",
      "name": "User One"
    },
    {
      "email": "user2@example.com",
      "date": "2024-02-27",
      "name": "User Two"
    }
  ]
}
```

 **Error Responses**  
- **403 Forbidden (Access Denied)**
  ```json
  {
    "status": "error",
    "message": "Access Denied"
  }
  ```

- **401 Unauthorized (Missing/Invalid Token)**
  ```json
  {
    "status": "error",
    "message": "Unauthorized: Token required"
  }
  ```

### **Authorization**  
This API requires authentication via a **Bearer Token**. Only users with **owner privileges** can access the data.

------------------------------------------------------------------------------------------------------------------------




# Delete Registration Request API

## **Endpoint**  
`DELETE /DeleteRegistrationRequest/:id`  

## **Description**  
This endpoint is used to delete a user registration request from the database. Only the owner of the request is allowed to perform the deletion.  

## **Request Parameters**  

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | String | The unique `_id` of the user in the database that needs to be deleted. |

## **Authorization**  
- Only the **owner** of the registration request can delete it.  
- Proper authentication is required before performing this action.

## **Example Request**  
```http
DELETE /DeleteRegistrationRequest/65f0abcd1234567890abcd12



-------------------------------------------------------------------------------------------------------------------------------------------



# Grant Access API

## **Endpoint**  
`POST /requestAccept`  

## **Description**  
This endpoint is used to grant access to users who are currently in the **AccessQueue** database. Only the **owner** can assign roles and accept requests.  

## **Authorization**  
- Only **owners** have the authority to assign roles.  
- If an **owner** wants to assign another **owner**, password verification is required.  

## **Request Body**  

| Parameter    | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `userId`    | String | Yes      | The unique `_id` of the user in the **AccessQueue** who is being granted access. |
| `AccessRole` | String | Yes      | The role to assign (`editor`, `viewer`, `owner`). |
| `password`  | String | Required only if granting **owner** role | The current owner's password for verification. |

## **Roles & Permissions**  
- `owner` → Can assign **editor, viewer, or another owner**.  
- `editor` → Limited editing permissions.  
- `viewer` → Read-only access.  
- Assigning a **new owner** requires **password verification** for security.  

## **Example Request**  
```http
POST /requestAccept
Content-Type: application/json
```
```json
{
  "userId": "65f0abcd1234567890abcd12",
  "AccessRole": "editor"
}
```
**For granting owner role (requires password verification)**:
```json
{
  "userId": "65f0abcd1234567890abcd12",
  "AccessRole": "owner",
  "password": "current_owner_password"
}
```

## **Response**  

### **Success Response**
- **Status Code:** `200 OK`  
- **Body:**
```json
{
  "message": "User granted access successfully."
}
```

### **Error Responses**
- **403 Forbidden:** If the user is not authorized to assign roles.
```json
{
  "error": "You are not authorized to grant access."
}
```
- **401 Unauthorized:** If the password verification fails for granting ownership.
```json
{
  "error": "Invalid password. Ownership transfer requires correct authentication."
}
```
- **404 Not Found:** If the user ID does not exist in the **AccessQueue**.
```json
{
  "error": "User not found in access queue."
}
```
- **500 Internal Server Error:** If there is a server-side issue.
```json
{
  "error": "Something went wrong. Please try again later."
}
```

## **Notes**
- Only **owners** can assign roles.
- **Password verification** is required when assigning another **owner**.

``-

----------------------------------------------------------------------------------------------------------------------



# Update User Access API

## Endpoint
`POST /accessQueue/updateUserAccess`

## Description
This endpoint allows an owner to update a user's access role. The owner can promote or demote a user between `viewer`, `editor`, and `owner` roles.

- **Promoting to `owner` requires password verification.**
- **Demotions or promotions (except to `owner`) do not require a password.**
- **The main creator (super admin) cannot be modified or deleted.**
- **Owners can change other owners' roles, including demoting or removing them.**

## Request Body
### **JSON Structure:**
```json
{
    "userId": "67c2c9f2f18cde57d633cb25",
    "AccessRole": "editor",
    "password": "Anya@123"
}
```

### **Fields:**
| Field       | Type   | Required | Description |
|------------|--------|----------|-------------|
| `userId`   | String | Yes      | The ID of the user whose access is being updated. |
| `AccessRole` | String | Yes      | The new access role (`viewer`, `editor`, or `owner`). |
| `password` | String | Conditional | Required **only when promoting a user to `owner`**. |

## Response
### **Success Response:**
#### **Status: `200 OK`**
```json
{
    "message": "User access updated to editor"
}
```

### **Error Responses:**
| Status Code | Message |
|-------------|---------|
| `400 Bad Request` | "User ID and Access Role are required." |
| `400 Bad Request` | "Invalid access role provided." |
| `400 Bad Request` | "Password is required when promoting to owner." |
| `400 Bad Request` | "Wrong password." |
| `403 Forbidden` | "Only owner can update access roles." |
| `403 Forbidden` | "The main owner cannot be modified." |
| `404 Not Found` | "User not found." |
| `500 Internal Server Error` | "Something went wrong." |

## Notes
- Owners can modify any user’s access, including other owners.
- The system prevents the deletion or modification of the main creator.
- If an invalid role is provided, the request will be rejected.
- If a user is promoted to `owner`, the granting owner must verify their password.

## Example Request
```sh
curl -X POST "https://yourapi.com/accessQueue/updateUserAccess" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
          "userId": "67c2c9f2f18cde57d633cb25",
          "AccessRole": "editor"
        }'
```

---
**Author:** API Team  
**Last Updated:** March 2025










