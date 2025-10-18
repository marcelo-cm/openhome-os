# Clothing Catalog - Product Requirements Document

## Overview

The Clothing Catalog is a personal wardrobe management system that allows users to digitally catalog their clothing items with AI-powered tagging, location tracking, and sharing capabilities. Users can manage their wardrobe, track item movements between locations, lend items to roommates, and (in future phases) create outfit combinations.

---

## Goals & Success Metrics

### Primary Goals

1. Enable users to build a comprehensive digital catalog of their clothing
2. Leverage AI to reduce manual data entry and improve item tagging
3. Support location tracking for users with multiple residences
4. Facilitate sharing and lending between roommates

### Success Metrics

- **Adoption**: 80% of active users catalog at least 10 items within first week
- **AI Accuracy**: 90%+ acceptance rate of AI-generated tags
- **Engagement**: 60% of users with cataloged items check their catalog weekly
- **Sharing**: 30% of multi-member homes use borrowing feature

---

## User Personas

### Primary Persona: The Multi-Location Professional

- **Name**: Sarah, 28, Product Designer
- **Situation**: Splits time between SF apartment and Toronto home
- **Pain Points**:
  - Forgets what clothes are at which location
  - Can't remember where she bought items or what she paid
  - Wastes time searching for specific pieces
- **Goals**: Quick reference to entire wardrobe, location awareness, purchase history

### Secondary Persona: The Collaborative Roommate

- **Name**: Alex, 25, Graduate Student
- **Situation**: Lives with 3 roommates, shares some clothing items
- **Pain Points**:
  - Forgets who borrowed what
  - No system for tracking returned items
  - Wants to browse roommates' wardrobes for outfit inspiration
- **Goals**: Easy lending/borrowing system, shared wardrobe visibility

---

## Feature Breakdown

### Phase 1: Core Catalog (MVP)

#### 1.1 Item Creation & AI Enhancement

##### User Flow

1. User uploads photo(s) of clothing item
2. System sends to Google Shop API + LLM for analysis
3. AI returns suggested attributes:
   - Brand
   - Item type/category
   - Base color
   - Pattern/graphic detection
   - Price estimate
   - Description
   - Suggested tags
   - Confidence scores for each attribute
4. User reviews AI suggestions in form
5. User completes/edits mandatory fields
6. User saves item to catalog

##### Required Fields

- **Photo** (at least 1, no format restrictions)
- **Name/Title** (user-defined or AI-suggested)
- **Current Location** (dropdown of user's projects)

##### Optional Fields

- **Brand**
- **Size**
- **Base Color** (AI-suggested, user can override)
- **Has Graphic** (boolean, AI-suggested)
- **Condition** (enum: New, Like New, Good, Fair, Worn)
- **Purchase Location/Store**
- **Purchase Price**
- **Purchase Date**
- **Last Worn Date**
- **Care Instructions**
- **Custom Tags** (multi-select or create new)
- **AI Description** (editable)
- **Notes** (free text)

##### Bulk Upload Flow

1. User uploads multiple photos at once
2. Each photo creates a draft item with AI analysis
3. Draft items appear in "Review Queue"
4. User reviews and completes each draft
5. User can save, edit, or delete drafts
6. Completed items move to main catalog

##### Technical Requirements

- Server-side pagination for all item lists
- Image optimization and storage (CDN)
- AI confidence scores stored with each attribute
- Visual indicator for AI-generated vs user-edited fields
- Debounced auto-save for form inputs
- Draft state with expiration (30 days)

---

#### 1.2 Item Management & Organization

##### Catalog Views

- **Grid View**: Photo thumbnails with minimal info overlay
- **List View**: Detailed rows with key attributes
- **Filters** (MVP):
  - Location
  - Tags
  - Color
  - Brand
  - Condition

##### Item Detail Page

- **Primary Photo** carousel (if multiple)
- **All Attributes** displayed in organized sections
- **Movement History** timeline
- **AI Confidence Indicators** for AI-generated fields
- **Edit Button** (owner only)
- **Actions Menu**:
  - Edit
  - Change Location
  - Share
  - Transfer
  - Delete

##### Search (MVP - Basic)

- Text search across: name, brand, description, tags
- Real-time search with debouncing
- Search results respect privacy settings

##### Analytics Dashboard (MVP)

- **Total Items** count
- **Total Value** sum of all purchase prices
- Breakdown by location
- Charts can be simple bar/pie charts

---

#### 1.3 Privacy & Sharing

##### Privacy Levels (per item)

1. **Private** (default)
   - Visible only to owner
   - Not discoverable or shareable

2. **Home Visible**
   - Visible to all members of user's home/organization
   - Appears in "Roommate Closets" view
   - Can be borrowed (with approval)

3. **Public**
   - Accessible via unique shareable link
   - No login required to view
   - Cannot be borrowed unless also Home Visible
   - Link can be regenerated to revoke access

##### ACL Integration

- Use existing ACL system from `/permissions`
- New ACL Resource: `CLOTHING_ITEM`
- Roles:
  - `OWNER`: Full control (edit, delete, transfer, set visibility)
  - `BORROWER`: Temporary custody, can view, cannot edit
  - `VIEWER`: Can view public/shared items

##### Sharing Features

- **Share Link Generation**: Creates unique URL for public items
- **Batch Privacy Update**: Select multiple items, change privacy level
- **Privacy Quick Actions**: Toggle privacy from item card

---

#### 1.4 Location & Movement Tracking

##### Location Management

- Items linked to user's Projects (code name) / Locations (UI name)
- User can have items in multiple locations
- Dropdown shows only user's accessible projects

##### Movement History

- **Immutable Log** of all location changes
- Each entry records:
  - Timestamp
  - Previous location
  - New location
  - User who initiated move
  - Optional notes

##### Change Location Flow

1. User selects item(s)
2. Clicks "Change Location"
3. Modal appears with:
   - Current location (read-only)
   - New location (dropdown)
   - Optional notes field
4. User confirms
5. Item location updates, history entry created

##### Movement History Display

- Timeline view on item detail page
- Reverse chronological order
- Shows date, locations, user, notes
- Export as CSV option

---

#### 1.5 Borrowing System

##### Request to Borrow Flow

1. **Requester (Borrower)**:
   - Views home-visible item from roommate
   - Clicks "Request to Borrow"
   - Modal appears:
     - Item details confirmation
     - Optional: Return by date picker
     - Optional: Message to owner
   - Submits request

2. **Owner Notification**:
   - Email notification sent immediately
   - In-app notification badge
   - Notification includes:
     - Who is requesting
     - Which item
     - Requested return date (if provided)
     - Message (if provided)

3. **Owner Reviews**:
   - Opens "Borrow Requests" page
   - Sees pending requests with all details
   - Can **Approve** or **Deny**:
     - **Approve**: Can add/edit return date, add notes
     - **Deny**: Can add reason (sent to requester)

4. **Post-Approval**:
   - Borrower receives approval notification (email + in-app)
   - Item status changes to "On Loan"
   - Item appears in borrower's "Borrowed Items" list
   - Item remains in owner's catalog with "Lent Out" badge
   - ACL: Borrower gains `BORROWER` role (temporary)

5. **Return Flow**:
   - **Option A**: Borrower clicks "Return Item"
     - Owner receives return notification
     - Owner confirms receipt
     - Status changes back to "Available"
   - **Option B**: Owner clicks "Mark as Returned"
     - No confirmation needed
     - Status changes immediately

6. **Return Reminders**:
   - If return date specified:
     - **2 days before**: Email to borrower
     - **On return date**: Email to borrower AND owner
     - **1 week overdue**: Email to both with escalation note

##### Borrowing States

- **Available**: Not currently borrowed
- **Pending Request**: Awaiting owner approval
- **On Loan**: Currently borrowed
- **Overdue**: Past return date, not yet returned

##### Borrowing Dashboard (for Owner)

- **Active Loans**: Items currently lent out
  - Who has it
  - Return date
  - Days remaining/overdue
  - Quick action: "Request Return" / "Mark Returned"
- **Pending Requests**: Awaiting approval
- **Loan History**: Past borrows with dates and borrowers

##### Borrowing Dashboard (for Borrower)

- **Current Borrows**: Items currently borrowed
  - From whom
  - Return date
  - Days remaining
  - Quick action: "Return Item"
- **Borrow History**: Past borrows

---

#### 1.6 Transfer Ownership

##### Transfer Flow

1. **Initiator (Current Owner)**:
   - Opens item detail page
   - Clicks "Transfer Ownership"
   - Modal appears:
     - Select recipient (dropdown of home members)
     - Optional: Transfer price (if selling)
     - Optional: Message to recipient
     - Checkbox: "Include in expense tracking" (if price provided)
   - Submits transfer request

2. **Recipient Notification**:
   - Email notification sent
   - In-app notification
   - Includes:
     - Item details with photo
     - Who is transferring
     - Price (if applicable)
     - Message (if provided)
   - Actions: **Accept** or **Decline**

3. **Post-Acceptance**:
   - Ownership changes to recipient
   - Item removed from original owner's catalog
   - Item added to recipient's catalog
   - Movement history entry created
   - If price provided and expense tracking enabled:
     - Creates expense record
     - Links to transfer transaction

4. **Post-Decline**:
   - Original owner notified
   - Item remains with original owner
   - Transfer request archived

##### Transfer History

- Stored in Movement History
- Special entry type: "Transfer"
- Includes: from user, to user, price, date
- Visible to both parties

---

### Phase 2: Outfit Combinations (Future)

#### 2.1 Outfit Builder (Simple MVP)

##### Create Outfit Flow

1. User navigates to "Create Outfit"
2. Catalog appears in multi-select mode
3. User selects clothing items
4. Preview shows selected items in grid
5. User fills out outfit form:
   - **Name** (required)
   - **Tags** (occasion, season, style)
   - **Notes**
6. User saves outfit

##### Outfit Management

- View all saved outfits (grid of outfit photos)
- Outfit detail page:
  - All items in outfit (linked)
  - Tags and notes
  - Date created / last worn
  - Actions: Edit, Favorite, Share, Delete

##### Outfit Sharing

- **Public Link**: Generates shareable URL
- **Home Visible**: Visible to roommates
- **Privacy**: Same ACL system as items

##### Outfit Features

- **Favorite**: Star outfits for quick access
- **Worn Date Tracking**: Log when outfit was worn
  - Updates "Last Worn" for all items in outfit

#### 2.2 Outfit Builder (Enhanced - Future Phase)

##### Drag & Drop Builder

- Split screen: Catalog on left, canvas on right
- Drag items onto mannequin/canvas
- Position items to visualize outfit
- Layering support (e.g., jacket over shirt)
- Visual representation of complete outfit

#### 2.3 AI Outfit Suggestions (Future Phase)

##### Smart Suggestions

- AI recommends outfits based on:
  - Weather at current location
  - Occasion tags
  - Color coordination
  - Style preferences (learned from user's favorited outfits)
  - Recently worn items (suggests less-worn pieces)

##### Mix & Match

- "Complete this outfit" feature
- User selects one item, AI suggests complementary pieces
- Visual preview of suggestions

---

### Phase 3: AI-Powered Search (Future)

#### Ideas for AI Search

##### Natural Language Search

- **Examples**:
  - "Blue graphic tees in SF"
  - "Black dresses I haven't worn in 3 months"
  - "Casual summer outfits under $50"
  - "Show me tops that match these jeans"
- Semantic understanding of queries
- Context-aware results

##### Visual Similarity Search

- **Upload or select reference photo**
- AI finds visually similar items in catalog
- Filter by similarity threshold
- Useful for finding forgotten items or alternatives

##### Smart Recommendations

- "You might like..." based on catalog patterns
- Seasonal reminders ("Time to pack for Toronto winter")
- Shopping suggestions (identifies gaps in wardrobe)

##### Contextual Search

- **Weather-aware**: "What can I wear in 50°F rain?"
- **Occasion-aware**: "Suggest outfit for formal dinner"
- **Location-aware**: Auto-filters to current location by default

---

## Data Model

### New Tables

#### `clothing_items`

```sql
-- Inherits base model (id, created_at, updated_at, deleted_at)
id: uuid (PK)
owner_id: uuid (FK → users.id)
name: varchar(255)
description: text
brand: varchar(100)
size: varchar(50)
base_color: varchar(50)
has_graphic: boolean
condition: enum('new', 'like_new', 'good', 'fair', 'worn')
purchase_location: varchar(255)
purchase_price: decimal(10,2)
purchase_date: date
last_worn_date: date
care_instructions: text
current_location_id: uuid (FK → projects.id)
privacy_level: enum('private', 'home_visible', 'public')
public_share_token: uuid (unique, nullable)
ai_metadata: jsonb -- stores AI confidence scores and raw responses
custom_attributes: jsonb -- extensible attributes
created_at: timestamp
updated_at: timestamp
deleted_at: timestamp (nullable)
```

**Indexes**:

- `owner_id, deleted_at`
- `current_location_id`
- `public_share_token` (unique)
- `privacy_level`

**Constraints**:

- `owner_id` must reference existing user
- `current_location_id` must reference existing project
- User must have access to the project

---

#### `clothing_item_tags`

```sql
id: uuid (PK)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
tag: varchar(100)
is_ai_generated: boolean
confidence_score: decimal(3,2) (nullable) -- 0.00 to 1.00
created_at: timestamp
```

**Indexes**:

- `item_id`
- `tag`

**Notes**:

- Many-to-many via junction table
- Allows duplicate tag names across items
- Confidence score only for AI-generated tags

---

#### `clothing_item_photos`

```sql
id: uuid (PK)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
url: varchar(500)
storage_key: varchar(500) -- for CDN/S3
thumbnail_url: varchar(500)
display_order: integer
is_primary: boolean
created_at: timestamp
```

**Indexes**:

- `item_id, display_order`

**Constraints**:

- At least one photo per item (enforced at application level)
- Only one `is_primary = true` per item

---

#### `item_movement_history`

```sql
id: uuid (PK)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
event_type: enum('location_change', 'transfer', 'loan_start', 'loan_end')
from_location_id: uuid (FK → projects.id, nullable)
to_location_id: uuid (FK → projects.id, nullable)
from_user_id: uuid (FK → users.id, nullable)
to_user_id: uuid (FK → users.id, nullable)
initiated_by_user_id: uuid (FK → users.id)
notes: text
metadata: jsonb -- stores event-specific data
created_at: timestamp
```

**Indexes**:

- `item_id, created_at DESC`
- `event_type`

**Notes**:

- Immutable log (no updates/deletes)
- Different event types populate different fields
- `metadata` can store loan return dates, transfer prices, etc.

---

#### `borrow_requests`

```sql
id: uuid (PK)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
borrower_id: uuid (FK → users.id)
owner_id: uuid (FK → users.id) -- denormalized for quick access
status: enum('pending', 'approved', 'denied', 'active', 'returned', 'cancelled')
requested_return_date: date (nullable)
actual_return_date: date (nullable)
borrower_message: text (nullable)
owner_response: text (nullable)
owner_notes: text (nullable)
created_at: timestamp
updated_at: timestamp
approved_at: timestamp (nullable)
returned_at: timestamp (nullable)
```

**Indexes**:

- `borrower_id, status`
- `owner_id, status`
- `item_id, status`
- `requested_return_date` (for reminder queries)

**State Transitions**:

- `pending` → `approved` | `denied` | `cancelled`
- `approved` → `active` (when marked as picked up)
- `active` → `returned`

---

#### `transfer_requests`

```sql
id: uuid (PK)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
from_user_id: uuid (FK → users.id)
to_user_id: uuid (FK → users.id)
status: enum('pending', 'accepted', 'declined', 'cancelled')
transfer_price: decimal(10,2) (nullable)
create_expense: boolean (default false)
message: text (nullable)
created_at: timestamp
updated_at: timestamp
completed_at: timestamp (nullable)
```

**Indexes**:

- `from_user_id, status`
- `to_user_id, status`
- `item_id`

---

#### `clothing_item_drafts`

```sql
id: uuid (PK)
user_id: uuid (FK → users.id)
photo_url: varchar(500)
ai_analysis: jsonb -- raw AI response
status: enum('pending_review', 'completed', 'discarded')
expires_at: timestamp -- 30 days from creation
created_at: timestamp
updated_at: timestamp
```

**Indexes**:

- `user_id, status`
- `expires_at` (for cleanup jobs)

---

### Phase 2 Tables

#### `outfits`

```sql
id: uuid (PK)
user_id: uuid (FK → users.id)
name: varchar(255)
notes: text
is_favorite: boolean (default false)
privacy_level: enum('private', 'home_visible', 'public')
public_share_token: uuid (unique, nullable)
last_worn_date: date (nullable)
created_at: timestamp
updated_at: timestamp
deleted_at: timestamp (nullable)
```

---

#### `outfit_items`

```sql
id: uuid (PK)
outfit_id: uuid (FK → outfits.id, ON DELETE CASCADE)
item_id: uuid (FK → clothing_items.id, ON DELETE CASCADE)
position_data: jsonb (nullable) -- for drag-n-drop phase
created_at: timestamp
```

**Indexes**:

- `outfit_id`
- `item_id`

---

#### `outfit_tags`

```sql
id: uuid (PK)
outfit_id: uuid (FK → outfits.id, ON DELETE CASCADE)
tag: varchar(100)
created_at: timestamp
```

---

## Permissions & Access Control

### ACL Resources

#### New ACL Resource: `CLOTHING_ITEM`

```typescript
// acl-enums.ts
export enum AclResource {
  LOCATION = 'location',
  CLOTHING_ITEM = 'clothing_item', // NEW
}
```

### ACL Roles for Clothing Items

```typescript
// acl-roles.ts
[AclResource.CLOTHING_ITEM]: {
  [AclRole.OWNER]: [
    ResourceAction.READ,
    ResourceAction.UPDATE,
    ResourceAction.DELETE,
    AclResourceAction.ADD_VIEWER,
    AclResourceAction.REMOVE_VIEWER,
    AclResourceAction.SHARE, // Custom: generate public link
    AclResourceAction.TRANSFER, // Custom: transfer ownership
    AclResourceAction.LEND, // Custom: approve borrow requests
  ],
  [AclRole.BORROWER]: [ // NEW ROLE
    ResourceAction.READ,
    // Temporary role during active loan period
  ],
  [AclRole.VIEWER]: [
    ResourceAction.READ,
    AclResourceAction.REQUEST_BORROW, // Custom: request to borrow
  ],
},
```

### Permission Checks

#### Item Visibility

```typescript
// Determine if user can view item
function canViewClothingItem(item: ClothingItem, user: User): boolean {
  // Owner can always view
  if (item.owner_id === user.id) return true;

  // Public items viewable by anyone with link
  if (item.privacy_level === 'public') return true;

  // Home visible items viewable by home members
  if (item.privacy_level === 'home_visible') {
    return isInSameHome(item.owner_id, user.id);
  }

  // Private items only for owner
  return false;
}
```

#### Borrowing Permission

```typescript
// Can user request to borrow?
function canRequestBorrow(item: ClothingItem, user: User): boolean {
  // Must be home-visible
  if (item.privacy_level !== 'home_visible') return false;

  // Must be in same home
  if (!isInSameHome(item.owner_id, user.id)) return false;

  // Cannot borrow own items
  if (item.owner_id === user.id) return false;

  // Item must not be currently on loan
  if (item.current_borrow_status === 'active') return false;

  return true;
}
```

---

## API Endpoints

### Items

#### `POST /api/clothing-items`

Create new clothing item

- **Auth**: Required
- **Body**: Item data + photos
- **Returns**: Created item with AI analysis

#### `GET /api/clothing-items`

List user's items with pagination

- **Auth**: Required
- **Query Params**:
  - `page`, `limit`
  - `location_id`, `tag`, `color`, `brand`, `condition`
  - `search` (text search)
- **Returns**: Paginated items

#### `GET /api/clothing-items/:id`

Get single item

- **Auth**: Optional (required for private items)
- **Returns**: Item details with full metadata

#### `PATCH /api/clothing-items/:id`

Update item

- **Auth**: Required (must be owner)
- **Body**: Partial item data
- **Returns**: Updated item

#### `DELETE /api/clothing-items/:id`

Soft delete item

- **Auth**: Required (must be owner)
- **Returns**: Success message

#### `POST /api/clothing-items/:id/location`

Change item location

- **Auth**: Required (must be owner)
- **Body**: `{ new_location_id, notes }`
- **Returns**: Updated item + movement history entry

#### `POST /api/clothing-items/:id/share`

Generate or regenerate public share link

- **Auth**: Required (must be owner)
- **Body**: `{ privacy_level: 'public' }`
- **Returns**: Share link

#### `GET /api/clothing-items/shared/:token`

View item via public share link

- **Auth**: Not required
- **Returns**: Item details (read-only)

---

### Drafts

#### `POST /api/clothing-items/drafts`

Create draft from photo upload

- **Auth**: Required
- **Body**: Photo file(s)
- **Returns**: Draft with AI analysis

#### `GET /api/clothing-items/drafts`

List user's drafts

- **Auth**: Required
- **Returns**: All pending drafts

#### `POST /api/clothing-items/drafts/:id/complete`

Convert draft to full item

- **Auth**: Required
- **Body**: Completed item data
- **Returns**: Created item

#### `DELETE /api/clothing-items/drafts/:id`

Discard draft

- **Auth**: Required
- **Returns**: Success message

---

### Borrowing

#### `POST /api/borrow-requests`

Request to borrow item

- **Auth**: Required
- **Body**: `{ item_id, requested_return_date?, message? }`
- **Returns**: Created borrow request

#### `GET /api/borrow-requests`

List borrow requests (sent or received)

- **Auth**: Required
- **Query Params**: `type: 'sent' | 'received'`, `status`
- **Returns**: Paginated requests

#### `PATCH /api/borrow-requests/:id/approve`

Approve borrow request

- **Auth**: Required (must be owner)
- **Body**: `{ return_date?, notes? }`
- **Returns**: Updated request + notification sent

#### `PATCH /api/borrow-requests/:id/deny`

Deny borrow request

- **Auth**: Required (must be owner)
- **Body**: `{ reason? }`
- **Returns**: Updated request + notification sent

#### `PATCH /api/borrow-requests/:id/return`

Mark item as returned

- **Auth**: Required (owner or borrower)
- **Returns**: Updated request + item status

#### `GET /api/borrow-requests/active`

Get active loans (for dashboard)

- **Auth**: Required
- **Returns**: Active loans as owner and as borrower

---

### Transfers

#### `POST /api/transfer-requests`

Initiate ownership transfer

- **Auth**: Required (must be owner)
- **Body**: `{ item_id, to_user_id, price?, message?, create_expense? }`
- **Returns**: Created transfer request

#### `GET /api/transfer-requests`

List transfer requests (sent or received)

- **Auth**: Required
- **Query Params**: `type: 'sent' | 'received'`, `status`
- **Returns**: Paginated requests

#### `PATCH /api/transfer-requests/:id/accept`

Accept transfer

- **Auth**: Required (must be recipient)
- **Returns**: Updated request + ownership transferred

#### `PATCH /api/transfer-requests/:id/decline`

Decline transfer

- **Auth**: Required (must be recipient)
- **Returns**: Updated request

---

### Analytics

#### `GET /api/clothing-items/analytics`

Get catalog analytics

- **Auth**: Required
- **Returns**:
  ```json
  {
    "total_items": 142,
    "total_value": 8450.0,
    "by_location": {
      "sf_apartment": { "count": 95, "value": 5200.0 },
      "toronto_home": { "count": 47, "value": 3250.0 }
    }
  }
  ```

---

### Movement History

#### `GET /api/clothing-items/:id/history`

Get movement history for item

- **Auth**: Required (must be owner or have view access)
- **Returns**: Chronological history entries

---

### Browse & Discovery

#### `GET /api/homes/:home_id/catalog`

View all public/home-visible items in a home

- **Auth**: Optional (signed-in users see more if in home)
- **Returns**: Paginated items from all home members

#### `GET /api/users/:user_id/catalog`

View specific user's public catalog

- **Auth**: Not required
- **Returns**: User's public items only

---

## UI/UX Specifications

### Key Pages

#### 1. My Catalog (Main View)

- **Layout**: Grid or list toggle
- **Header**:
  - Search bar
  - Filter button (opens sidebar/modal)
  - View toggle (grid/list)
  - "Add Item" button (primary CTA)
  - "Upload Multiple" button
- **Content**:
  - Item cards/rows
  - Infinite scroll or pagination
  - Empty state with onboarding
- **Item Card** (Grid):
  - Primary photo
  - Item name
  - Location badge
  - Privacy indicator (icon)
  - On Loan badge (if applicable)
  - Quick actions on hover: View, Edit, Share

#### 2. Add Item

- **Step 1: Upload Photo**
  - Drag-and-drop zone
  - Click to upload
  - Camera access on mobile
  - Multi-file support
- **Step 2: AI Analysis**
  - Loading state with progress
  - "Analyzing your item..."
  - Shows confidence indicators as they populate
- **Step 3: Review & Complete**
  - Form with AI-suggested values pre-filled
  - Visual confidence indicators (⭐️ icons or %)
  - Editable fields
  - Required field indicators
  - Location dropdown
  - Tag input with suggestions
  - Save button

#### 3. Item Detail Page

- **Left Column**:
  - Photo carousel
  - AI confidence badges on hover
- **Right Column**:
  - Item name (editable inline)
  - All attributes in sections:
    - Basic Info
    - Purchase Details
    - Care & Maintenance
    - Tags
  - Privacy setting toggle
  - Share button
  - Actions menu (•••):
    - Edit
    - Change Location
    - Transfer Ownership
    - Delete
- **Bottom Section**:
  - Movement History timeline
  - Active loan info (if applicable)

#### 4. Draft Review Queue

- **List of Drafts**:
  - Thumbnail
  - AI-suggested name
  - "Complete" CTA
  - "Discard" button
  - Days until expiration
- **Batch Actions**:
  - Select multiple
  - Complete all (opens multi-step form)
  - Discard all

#### 5. Borrow Requests (Owner View)

- **Tabs**: Pending | Active Loans | History
- **Pending Requests**:
  - Requester info with avatar
  - Item thumbnail
  - Requested return date
  - Message
  - Actions: Approve, Deny
- **Active Loans**:
  - Borrower info
  - Item thumbnail
  - Return date with countdown
  - Overdue indicator (if applicable)
  - Actions: Request Return, Mark Returned

#### 6. My Borrows (Borrower View)

- **Tabs**: Current | Requested | History
- **Current Borrows**:
  - Item thumbnail
  - Owner info
  - Return date with countdown
  - Overdue warning (if applicable)
  - Action: Return Item
- **Requested**:
  - Items awaiting approval
  - Cancel request option

#### 7. Analytics Dashboard

- **Top Stats** (cards):
  - Total Items
  - Total Value
- **Charts**:
  - Items by Location (bar chart)
  - Value by Location (pie chart)

#### 8. Roommate Closets

- **Home Member List**:
  - Member avatar + name
  - Item count
  - Click to view their catalog
- **Member's Catalog View**:
  - Similar to My Catalog
  - Items show "Request to Borrow" button
  - Respect privacy settings

#### 9. Public Catalog View (via link)

- **Read-only catalog view**
- User info banner (name, avatar)
- Grid of items
- No edit/borrow actions
- "Get OpenHomeOS" CTA banner

---

### Component Specifications

#### Item Card (Grid View)

```tsx
interface ItemCardProps {
  item: ClothingItem;
  viewMode: 'owner' | 'viewer';
  onBorrowRequest?: () => void;
}

// Features:
// - 1:1 aspect ratio photo
// - Hover overlay with quick actions
// - Privacy badge (lock icon for private)
// - Location badge (bottom left)
// - "On Loan" badge (top right, yellow)
// - AI confidence indicator (subtle, top left)
```

#### AI Confidence Indicator

```tsx
interface ConfidenceIndicatorProps {
  score: number; // 0.00 to 1.00
  attribute: string;
}

// Visual styles:
// - 0.00 - 0.60: Red/Orange (Low confidence)
// - 0.60 - 0.80: Yellow (Medium confidence)
// - 0.80 - 1.00: Green (High confidence)
// - Icon: ⭐️ or percentage
// - Tooltip: "AI is {confidence}% confident"
```

#### Location Selector

```tsx
interface LocationSelectorProps {
  currentLocationId: string;
  userProjects: Project[];
  onChange: (locationId: string) => void;
}

// Features:
// - Dropdown with project names
// - Current location highlighted
// - Optionally show item count per location
```

#### Borrow Request Modal

```tsx
interface BorrowRequestModalProps {
  item: ClothingItem;
  owner: User;
  onSubmit: (data: BorrowRequestData) => void;
}

// Fields:
// - Item preview (read-only)
// - Return date picker (optional)
// - Message textarea (optional)
// - Submit button: "Request to Borrow"
```

---

## Technical Implementation

### AI Integration

#### Google Shop API + LLM Flow

```typescript
async function analyzeClothingPhoto(imageUrl: string): Promise<AIAnalysis> {
  // Step 1: Google Shop API - Get product matches
  const shopResults = await googleShopAPI.search({
    image: imageUrl,
    limit: 5,
  });

  // Step 2: Extract structured data from top matches
  const productData = shopResults.map((r) => ({
    brand: r.brand,
    title: r.title,
    price: r.price,
    category: r.category,
  }));

  // Step 3: Send to LLM for analysis
  const llmPrompt = `
    Analyze this clothing item image and the following product matches:
    ${JSON.stringify(productData)}

    Extract:
    1. Brand (most likely brand from matches)
    2. Item type/category
    3. Base color (primary color, one word)
    4. Has graphic? (boolean)
    5. Pattern type (solid, striped, floral, etc.)
    6. Brief description (1 sentence)
    7. Suggested tags (5-10 relevant tags)
    8. Confidence scores for each extraction (0-1)

    Return as JSON.
  `;

  const llmResponse = await llm.analyze(llmPrompt, imageUrl);

  return {
    brand: llmResponse.brand,
    category: llmResponse.category,
    base_color: llmResponse.base_color,
    has_graphic: llmResponse.has_graphic,
    description: llmResponse.description,
    tags: llmResponse.tags,
    confidence_scores: llmResponse.confidence_scores,
    raw_shop_results: shopResults,
    raw_llm_response: llmResponse,
  };
}
```

### Notification System

#### Email Templates

- **Borrow Request Received** (to owner)
- **Borrow Request Approved** (to borrower)
- **Borrow Request Denied** (to borrower)
- **Return Reminder - 2 Days** (to borrower)
- **Return Due Today** (to borrower & owner)
- **Item Overdue** (to borrower & owner)
- **Transfer Request Received** (to recipient)
- **Transfer Accepted** (to original owner)
- **Transfer Declined** (to original owner)

#### In-App Notifications

- Use existing notification system
- Badge counts on:
  - Borrow Requests tab
  - Transfer Requests tab
  - Overdue items indicator

### Background Jobs

#### Draft Cleanup Job

- **Frequency**: Daily
- **Task**: Delete drafts older than 30 days
- **Query**: `DELETE FROM clothing_item_drafts WHERE expires_at < NOW()`

#### Return Reminder Job

- **Frequency**: Daily at 9 AM user's timezone
- **Task**:
  - Find loans due in 2 days → send reminder to borrower
  - Find loans due today → send reminder to borrower & owner
  - Find loans 7+ days overdue → send escalation email

#### Email Template

```typescript
// 2 days before return
{
  to: borrower.email,
  subject: "Reminder: Return [Item Name] by [Date]",
  body: `
    Hi ${borrower.name},

    Just a friendly reminder that you borrowed "${item.name}"
    from ${owner.name}, and it's due back on ${returnDate}.

    [View Item] [Mark as Returned]
  `
}

// On return date
{
  to: [borrower.email, owner.email],
  subject: "Return Due Today: [Item Name]",
  body: `...`
}

// Overdue
{
  to: [borrower.email, owner.email],
  subject: "Overdue: [Item Name] - Action Needed",
  body: `...`
}
```

---

## Edge Cases & Error Handling

### Item Deletion

- **If item has active borrow**: Prevent deletion, show error
  - "Cannot delete item while on loan. Please wait for return or cancel the loan."
- **If item has pending borrow/transfer**: Allow deletion, cancel all pending requests
- **Soft delete**: Set `deleted_at`, keep in database for history

### Location Changes

- **If item is on loan**: Prevent location change until returned
  - Location automatically updated when returned to reflect borrower's return location

### Borrowing

- **Double borrow**: If item already has pending/active borrow, prevent new request
- **Self-borrow**: Prevent users from borrowing their own items
- **Deleted item**: If item deleted while borrow pending, auto-deny request

### Transfer

- **Double transfer**: If transfer pending, prevent new transfer request
- **Item on loan**: Prevent transfer while item is loaned out
- **Deleted item**: Auto-cancel pending transfers
- **User leaves home**: If recipient leaves home, auto-cancel pending transfers

### Privacy Changes

- **Public to Private**: Invalidate share links
- **Home Visible to Private**: Cancel pending borrows from roommates

### Photo Management

- **Last photo deletion**: Prevent if it's the only photo
  - "Items must have at least one photo"
- **Storage limits**: Implement per-user photo limits (e.g., 1000 photos)

---

## Performance Considerations

### Database Optimization

- **Indexes**: All foreign keys indexed
- **Pagination**: Server-side cursor-based pagination for large catalogs
- **Eager loading**: Load related data (photos, tags) in single query
- **Caching**: Cache public catalogs and frequently accessed items

### Image Optimization

- **Upload**: Resize to max 2048px, compress
- **Thumbnails**: Generate 300px thumbnails for grid view
- **CDN**: Serve all images via CDN
- **Lazy loading**: Implement lazy loading for grids

### AI Analysis

- **Async processing**: Queue AI analysis jobs
- **Batch processing**: Process bulk uploads in batches
- **Caching**: Cache AI results to avoid re-analysis
- **Rate limiting**: Limit uploads per user per hour

### Real-time Updates

- **Notifications**: Use websockets or polling for notification badges
- **Optimistic UI**: Update UI immediately, rollback on error

---

## Success Metrics & Analytics

### User Engagement

- **DAU/MAU**: Daily/monthly active users
- **Catalog Completion Rate**: % of users with 10+ items
- **Time to First Item**: Median time from signup to first item cataloged
- **Bulk Upload Adoption**: % of users who use bulk upload
- **Draft Completion Rate**: % of drafts completed vs. discarded

### Feature Usage

- **AI Override Rate**: How often users edit AI suggestions
- **Borrow Request Rate**: # of borrow requests per active user
- **Borrow Approval Rate**: % of requests approved
- **Transfer Completion Rate**: % of transfers accepted
- **Public Sharing Rate**: % of items made public

### Quality Metrics

- **AI Confidence**: Average confidence score across all analyses
- **Photo Quality**: Distribution of photo sizes/quality
- **Tag Diversity**: Average tags per item
- **Catalog Value**: Average total value per user

### System Health

- **AI Analysis Time**: p50, p95, p99 latency
- **Page Load Time**: By route
- **Error Rate**: By endpoint
- **Storage Usage**: Per user, total

---

## Future Enhancements (Phase 3+)

### Advanced Features

1. **Wardrobe Insights**
   - Cost per wear calculations
   - Underutilized items alerts
   - Shopping recommendations based on gaps

2. **Social Features**
   - Follow other users
   - Outfit inspiration feed
   - Style challenges

3. **Integrations**
   - Import from online shopping accounts
   - Sync with calendar for outfit planning
   - Weather API for smart suggestions

4. **Sustainability Tracking**
   - Carbon footprint of wardrobe
   - Secondhand vs. new tracking
   - Repair/alteration history

5. **Commerce**
   - Sell items to roommates or publicly
   - Integrated payment processing
   - Rental marketplace

---

## Appendix

### Glossary

- **Catalog**: A user's collection of clothing items
- **Draft**: Incomplete item awaiting user review after photo upload
- **Movement History**: Immutable log of location changes and transfers
- **On Loan**: Item currently borrowed by another user
- **Home Visible**: Privacy setting allowing roommates to see item
- **Public**: Privacy setting allowing anyone with link to view item

### References

- [Google Shop API Documentation](https://developers.google.com/custom-search)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Permissions System README](/permissions/README.md)
- [Data Model Documentation](/docs/data-model.md)

---

**Document Version**: 1.0  
**Last Updated**: October 18, 2025  
**Author**: Product Team  
**Status**: Draft for Review
