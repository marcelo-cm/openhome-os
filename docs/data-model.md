# Data Model

## Base Model
- ID
- Created At
- Updated At
- Deleted At (Soft delete)

## Homes
- Name
- Address

## Rooms
- Home ID
- Description

## Items
- Name
- Description
- Category
- Purchase ID
- Purchased Price
- Owner ID (If house owns it, it's considered shared)
- Owner Type (User, or house)
- Location (room)
- Extra information (JSONB)

## Users
- Name
- Email
- Profile picture
- Phone Number
- House ID
- Payment Information (JSONB)
- Role

## Photos
- URL
- Attachable ID
- Attachable Type (Can belong to a home, room, expense, or item)
- Description

## Expenses
- Description
- Amount
- Date
- Category
- Vendor
- Payer ID

## Expense Splits
- Expense ID
- User ID (who owes this portion)
- Amount
- Payment ID (foreign key to Payments, nullable - populated when paid)
- Receipt URL

## Payments
- From User ID (payer)
- To User ID (payee)
- Amount
- Payment method

## Item Categories
- Category Name
- House ID

## Vendors
- Location
- House ID