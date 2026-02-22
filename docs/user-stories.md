# Carpoolear - User Stories

## Table of Contents

1. [Authentication & Account](#1-authentication--account)
2. [User Profile](#2-user-profile)
3. [Friends & Social](#3-friends--social)
4. [Trip Management (Driver)](#4-trip-management-driver)
5. [Trip Search & Requests (Passenger)](#5-trip-search--requests-passenger)
6. [Passenger Request Lifecycle](#6-passenger-request-lifecycle)
7. [Messaging & Conversations](#7-messaging--conversations)
8. [Ratings & Reviews](#8-ratings--reviews)
9. [Subscriptions (Auto-Matching)](#9-subscriptions-auto-matching)
10. [Notifications](#10-notifications)
11. [Payments](#11-payments)
12. [End-to-End Workflow Scenarios](#12-end-to-end-workflow-scenarios)

---

## 1. Authentication & Account

### 1.1 Registration
As a **visitor**, I should be able to create an account by providing my name, email, and password, so that I can start using the carpooling platform.
- Account requires accepting Terms & Conditions before proceeding.
- Email must be unique across the platform.

### 1.2 Login
As a **registered user**, I should be able to log in with my email and password, so that I can access my trips, messages, and profile.
- Authentication uses JWT tokens.
- Session persists until the token expires or I log out.

### 1.3 Social Login
As a **visitor**, I should be able to register or log in using my Facebook account, so that I can skip manual registration.

### 1.4 Password Reset
As a **user who forgot their password**, I should be able to request a password reset email, receive a link, and set a new password so that I can regain access to my account.

### 1.5 Logout
As a **logged-in user**, I should be able to log out, which invalidates my session and unregisters my device from push notifications.

### 1.6 Account Activation
As a **newly registered user**, I should be able to activate my account so that I can fully use the platform (post trips, send requests, etc.).

---

## 2. User Profile

### 2.1 View My Profile
As a **user**, I should be able to view my own profile showing my name, photo, rating summary, and trip history.

### 2.2 Edit My Profile
As a **user**, I should be able to update my name, profile photo, and other personal information so that other users can identify me.

### 2.3 View Another User's Profile
As a **user**, I should be able to view another user's public profile, including their name, photo, ratings, and whether we are friends, so that I can decide whether to ride with them.

### 2.4 Configure Auto-Accept
As a **driver**, I should be able to enable "auto-accept requests" in my profile settings, so that passenger requests for my trips are automatically accepted without manual intervention.
- When auto-accept is on and the payment module is enabled, passengers go to a "waiting payment" state instead of directly accepted.

### 2.5 Configure Full Trip Notifications
As a **driver**, I should be able to enable a setting so that when my trip fills up (all seats taken), a message is automatically sent to all accepted passengers letting them know the trip is full.

---

## 3. Friends & Social

### 3.1 Search for Users
As a **user**, I should be able to search for other users by name so that I can find people I know and add them as friends.

### 3.2 Send Friend Request
As a **user**, I should be able to send a friend request to another user so that we can be connected on the platform.
- The recipient receives a notification (in-app, push, and email).

### 3.3 Accept Friend Request
As a **user**, I should be able to accept a pending friend request, which establishes a mutual friendship and allows us to see each other's friends-only trips.
- The requester receives a notification that I accepted.

### 3.4 Reject / Remove Friend
As a **user**, I should be able to reject a pending friend request or remove an existing friend from my connections.

### 3.5 View Friends List
As a **user**, I should be able to see my list of friends and pending friend requests (both sent and received).

---

## 4. Trip Management (Driver)

### 4.1 Create a Trip
As a **driver**, I should be able to create a trip by specifying:
- **Origin and destination** (with geographic coordinates and address).
- **Intermediate waypoints** (optional, for multi-stop routes).
- **Date and time** of departure.
- **Total seats available** for passengers.
- **Price per seat** (optional).
- **Privacy level**: public, friends-only, or friends-of-friends.
- **Description** or notes about the trip.

Upon creation:
- The system calculates the route via OSRM, including distance, estimated duration, and CO2 savings.
- The system suggests a recommended price based on distance and tolls.
- If the seat price exceeds the calculated maximum (based on distance), I am warned or capped.
- If the route is in a "paid zone" (Sellado) and I've exceeded the free trip threshold, I am redirected to pay a regulatory fee via MercadoPago before the trip goes live.

### 4.2 Create a Recurring Trip
As a **driver**, I should be able to create a weekly recurring trip (e.g., every Monday and Wednesday) so that passengers can find and join my regular commute without me re-posting each week.
- Recurring trips do not expire based on date.

### 4.3 Edit a Trip
As a **driver**, I should be able to edit my trip's details (date, time, seats, price, route) before it takes place.
- All accepted passengers receive a notification about the change.
- If the route changes and now enters a paid zone, I may need to pay the Sellado fee.
- If the route changes and leaves a paid zone, any existing Sellado payment is cleared.

### 4.4 Cancel / Delete a Trip
As a **driver**, I should be able to cancel or delete my trip.
- All accepted passengers are notified of the cancellation.
- Pending requests are automatically canceled.

### 4.5 View My Trips
As a **driver**, I should be able to see a list of all trips I've created, both upcoming and past, along with their status (active, full, canceled, completed).

### 4.6 View Passenger Requests for My Trip
As a **driver**, I should be able to see all passenger requests for a specific trip, including their status (pending, accepted, rejected, canceled), so I can manage who joins.

---

## 5. Trip Search & Requests (Passenger)

### 5.1 Search for Trips
As a **passenger**, I should be able to search for available trips by specifying:
- **Origin** (city, address, or coordinates with radius).
- **Destination** (city, address, or coordinates with radius).
- **Date** (specific date, or date range ±3 days).
- The search results only include trips I'm allowed to see based on the driver's privacy settings (public trips, or friends/friends-of-friends trips if I'm connected).

### 5.2 View Trip Details
As a **passenger**, I should be able to view the full details of a trip including:
- Driver's name and profile (with rating).
- Route with origin, destination, and waypoints.
- Date, time, and estimated duration.
- Price per seat.
- Number of available seats remaining.
- Other accepted passengers (if visible).

### 5.3 Request to Join a Trip
As a **passenger**, I should be able to send a request to join a trip.
- The driver receives a notification (in-app, push, and email).
- I cannot send multiple active requests (pending/accepted) for the same trip.
- I cannot request a trip that has already departed.
- If the driver has auto-accept enabled, my request is immediately accepted (or moves to "waiting payment" if payment is required).

### 5.4 Cancel My Request
As a **passenger**, I should be able to cancel my own pending request before the driver responds.
- If I cancel after being accepted, the seat is freed up for other passengers.

### 5.5 View My Requests
As a **passenger**, I should be able to see all my trip requests and their current status (pending, accepted, rejected, canceled) so I can track which trips I'm confirmed for.

---

## 6. Passenger Request Lifecycle

### 6.1 Accept a Passenger Request
As a **driver**, I should be able to accept a pending passenger request for my trip.
- The passenger is notified of acceptance.
- The available seat count decreases by one.
- If the trip is now full (no seats remaining), all accepted passengers optionally receive a "trip is full" message.

### 6.2 Reject a Passenger Request
As a **driver**, I should be able to reject a pending passenger request.
- The passenger is notified of the rejection.
- The seat count is not affected.

### 6.3 Cancel an Accepted Passenger (Driver-Initiated)
As a **driver**, I should be able to cancel a previously accepted passenger from my trip.
- The passenger is notified that the driver removed them.
- The seat becomes available again.
- The cancellation is recorded with the reason "canceled by driver."

### 6.4 Cancel After Acceptance (Passenger-Initiated)
As a **passenger**, I should be able to cancel my accepted seat on a trip.
- The driver is notified that I canceled.
- The seat becomes available again.
- The cancellation is recorded with the reason "canceled by passenger."

### 6.5 Request Limits
As a **passenger**, if the platform has request limiting enabled, I should not be able to send requests for similar trips (same route) within a configured time window, to prevent spam requests.

### 6.6 Unanswered Request Limit
As a **passenger**, if a driver has too many unanswered requests or conversations on a trip, I should be blocked from making new requests until the driver responds to existing ones, encouraging driver engagement.

---

## 7. Messaging & Conversations

### 7.1 Send a Message to a User
As a **user**, I should be able to start a private conversation with another user if:
- They are my friend.
- They are an admin.
- We are co-passengers on the same trip.
- They have a public trip I can see.
- I cannot message myself.

### 7.2 Trip-Related Conversation
As a **passenger or driver**, when I request or accept a trip, I should be able to have a conversation tied to that specific trip for coordinating pickup details, timing, etc.

### 7.3 View My Conversations
As a **user**, I should be able to see a list of all my conversations, ordered by most recent message, with an indicator showing unread messages.

### 7.4 Read / Send Messages in a Conversation
As a **user**, I should be able to open a conversation, see the full message history (with pagination for older messages), and send new messages.
- Messages are delivered in real-time where possible.
- The other participant receives a push notification for new messages.

### 7.5 Mark Messages as Read
As a **user**, when I open a conversation, my unread messages in that conversation should be automatically marked as read, and the unread count on my conversation list should update.

### 7.6 Full Trip Auto-Message
As an **accepted passenger**, when the last seat on my trip is filled, I should receive an automatic message in the trip conversation saying "The trip is now full" (if the driver enabled this feature).

---

## 8. Ratings & Reviews

### 8.1 Rate a Trip Companion
As a **user** (driver or passenger), after a trip is completed, I should be able to rate my trip companions (positive or negative) and leave an optional comment.
- Ratings become available after the trip date passes.
- I have a 25-day window to submit my rating before it expires.

### 8.2 View Pending Ratings
As a **user**, I should be able to see a list of trips I haven't rated yet, so I can submit my feedback.

### 8.3 Reply to a Rating
As a **user**, if someone rated me, I should be able to leave a reply comment to their rating so I can provide my side of the story.

### 8.4 View Rating History
As a **user**, I should be able to see all ratings I've received (positive and negative) with comments, so I can understand my reputation on the platform.

### 8.5 Rating via Link
As a **user**, I should be able to rate a trip companion by clicking a unique link (sent via email or notification) without needing to navigate through the app, for convenience.

---

## 9. Subscriptions (Auto-Matching)

### 9.1 Create a Trip Subscription
As a **passenger**, I should be able to save a trip search as a subscription by specifying my desired origin, destination, and optionally a date, so the system can automatically notify me when matching trips are posted.
- Subscriptions are active for 6 months.

### 9.2 Auto-Request on Match
As a **passenger with an active subscription**, when a driver posts a new trip that matches my subscription (route, date, and I have permission to see the trip), the system should automatically create a passenger request on my behalf.
- I am notified that an auto-request was made.

### 9.3 Manage Subscriptions
As a **user**, I should be able to view, activate, deactivate, or delete my subscriptions.

---

## 10. Notifications

### 10.1 In-App Notifications
As a **user**, I should receive in-app notifications for:
- Passenger request received (driver).
- Request accepted / rejected / canceled.
- Trip details updated.
- Friend request received / accepted.
- Rating available.
- Auto-request created by subscription match.
- Request auto-canceled due to limits.

### 10.2 Push Notifications
As a **user** with the mobile app, I should receive push notifications on my registered devices for all important events, so I stay informed even when not actively using the app.

### 10.3 Email Notifications
As a **user**, I should receive email notifications for critical events (requests, acceptances, cancellations, ratings) so I have a record and don't miss important updates.

### 10.4 Mark Notifications as Read
As a **user**, I should be able to mark notifications as read (individually or all at once) to manage my notification list.

### 10.5 Delete Notifications
As a **user**, I should be able to delete notifications I no longer need.

### 10.6 Register Device for Push
As a **user**, when I log in on a mobile device, my device token should be registered so I can receive push notifications. When I log out, the token should be unregistered.

---

## 11. Payments

### 11.1 Sellado / Regulatory Fee (Driver)
As a **driver**, if I create a trip through a paid zone and I've exceeded the free trip threshold, I should be redirected to MercadoPago to pay the regulatory "Sellado" fee before my trip becomes visible to passengers.
- If the payment fails, the trip remains in an "awaiting payment" state and is not visible in search.
- If I update the route to avoid the paid zone, the payment requirement is removed.

### 11.2 Seat Payment (Passenger)
As a **passenger**, if the payment module is enabled and my request is accepted (or auto-accepted), I should be prompted to pay for my seat before my reservation is fully confirmed.
- If I don't pay, my request stays in "waiting payment" state.
- I can cancel while in payment state.

### 11.3 View Transaction History
As a **user**, I should be able to view my past trip transactions (as driver or passenger), including payment status and dates, for my records.

---

## 12. End-to-End Workflow Scenarios

### Scenario A: Complete Trip Lifecycle (Happy Path)

> **Driver creates trip → Passenger finds and joins → They coordinate → Trip happens → Both rate each other**

1. **Ana (Driver)** creates a trip from Rosario to Buenos Aires for next Saturday, 3 available seats, $5000/seat, public visibility.
2. The system calculates the route (350km, ~3.5h), suggests a price, and publishes the trip.
3. **Carlos (Passenger)** searches for Rosario → Buenos Aires trips for Saturday and finds Ana's trip.
4. Carlos views the trip details, sees Ana has a 4.5-star rating, and sends a request to join.
5. Ana receives a push notification: "Carlos wants to join your trip."
6. Ana reviews Carlos's profile and accepts the request.
7. Carlos receives a notification: "Ana accepted your request!"
8. Carlos and Ana exchange messages in the trip conversation to coordinate pickup time and exact location.
9. Saturday arrives, they travel together.
10. After the trip, both Ana and Carlos receive a "Rate your companion" notification.
11. Ana rates Carlos positively: "Great passenger, was on time."
12. Carlos rates Ana positively: "Safe driver, pleasant conversation."

---

### Scenario B: Trip Fills Up and Cancellation

> **Trip fills up → One passenger cancels → Seat reopens → New passenger joins**

1. **Beto (Driver)** creates a trip with 2 available seats.
2. **Diana** requests to join → Beto accepts. (1 seat remaining)
3. **Eduardo** requests to join → Beto accepts. (0 seats remaining)
4. If Beto has "full trip message" enabled, both Diana and Eduardo receive: "The trip is now full."
5. **Fernando** searches and sees the trip but cannot request (no seats).
6. Eduardo's plans change — he cancels his accepted seat.
7. The trip now has 1 seat available again.
8. Fernando searches again, sees the seat is available, and sends a request.
9. Beto accepts Fernando.

---

### Scenario C: Auto-Accept with Messaging

> **Driver with auto-accept enabled → Passenger requests → Immediately accepted → They coordinate via chat**

1. **Gabi (Driver)** has "auto-accept requests" enabled in her profile.
2. Gabi creates a trip from Rosario to Santa Fe, 2 seats available.
3. **Hugo** finds the trip and sends a request.
4. The system automatically accepts Hugo's request (no driver action needed).
5. Hugo receives a notification: "Your request was automatically accepted!"
6. Hugo opens the trip conversation and messages: "Hi Gabi, can you pick me up at the bus terminal?"
7. Gabi receives a push notification for the message, opens the chat, and responds: "Sure, I'll be there at 8am."

---

### Scenario D: Subscription Auto-Match

> **Passenger sets up a subscription → Driver later posts a matching trip → System auto-requests on passenger's behalf**

1. **Ivana (Passenger)** regularly travels from Rosario to Paraná on Fridays but no trips are available right now.
2. Ivana creates a subscription: Origin=Rosario, Destination=Paraná, Date=Fridays.
3. Two weeks later, **Juan (Driver)** creates a trip Rosario → Paraná for this Friday.
4. The system matches Juan's trip against active subscriptions and finds Ivana's match.
5. The system automatically creates a passenger request from Ivana for Juan's trip.
6. Ivana receives a notification: "A matching trip was found! A request was sent automatically."
7. Juan receives the request notification and can accept or reject as usual.

---

### Scenario E: Friends-Only Trip Privacy

> **Driver creates friends-only trip → Only friends can see it → Non-friend cannot find it**

1. **Karen (Driver)** creates a trip with privacy set to "friends only."
2. **Leo**, who is Karen's friend, searches for trips and sees Karen's trip in the results.
3. **Maria**, who is NOT Karen's friend, searches for the same route and date — Karen's trip does not appear in her results.
4. **Nora**, who is friends with Leo (friend-of-friend of Karen), searches:
   - If the trip privacy is "friends of friends," Nora can see the trip.
   - If the trip privacy is "friends only," Nora cannot see it.

---

### Scenario F: Driver Rejects Request and Passenger Rates Negatively

> **Driver rejects → Passenger finds another trip → Has a bad experience → Rates negatively**

1. **Oscar (Passenger)** requests to join **Pablo's** trip.
2. Pablo reviews Oscar's profile, sees a low rating, and rejects the request.
3. Oscar receives a "Request rejected" notification.
4. Oscar searches again and finds **Quique's** trip on the same route and date.
5. Quique accepts Oscar's request. They coordinate via chat.
6. The trip happens, but Quique was 30 minutes late and drove unsafely.
7. After the trip, Oscar rates Quique negatively with comment: "Was very late and drove too fast."
8. Quique sees the negative rating and writes a reply: "There was unexpected traffic, I apologize."

---

### Scenario G: Payment-Required Trip Flow

> **Driver must pay Sellado → Pays via MercadoPago → Trip goes live → Passenger pays for seat**

1. **Rosa (Driver)** has already posted 5 free trips (above the threshold).
2. Rosa creates a new trip on a route that crosses a paid zone.
3. The system calculates the Sellado fee and returns a MercadoPago payment URL.
4. Rosa is redirected to MercadoPago, pays the fee, and returns.
5. The trip state changes from "Awaiting Payment" to "Paid" and becomes visible in search.
6. **Santi (Passenger)** requests to join. Rosa accepts.
7. Since the payment module is active for seats, Santi's request moves to "Waiting Payment."
8. Santi pays for the seat via the platform.
9. Santi's request is confirmed as "Accepted."

---

### Scenario H: Recurring Commute with Multiple Passengers

> **Driver creates recurring weekly trip → Multiple passengers join over time → Ongoing coordination**

1. **Tina (Driver)** creates a recurring trip Rosario → Santa Fe every Monday and Wednesday.
2. The trip doesn't expire — it stays in search results indefinitely.
3. Week 1: **Uli** finds and joins the Monday trip. They message to coordinate.
4. Week 2: **Vero** also joins. Tina now has 2 regular passengers.
5. Week 3: Tina needs to update the departure time from 7:00 to 7:30.
6. Tina edits the trip. Both Uli and Vero receive a notification: "Trip details have been updated."
7. They continue riding together each week, rating each other periodically.

---

### Scenario I: Unanswered Request Limit

> **Driver doesn't respond → System blocks new requests → Driver responds → Requests unblocked**

1. **Walter (Driver)** creates a trip but gets busy and doesn't check the app.
2. **Xime** sends a request → Walter doesn't respond (pending).
3. **Yani** sends a request → Walter doesn't respond (pending).
4. **Zoe** tries to send a request, but the system detects Walter has too many unanswered requests/conversations.
5. Zoe sees an error or message: "This driver has pending requests to answer. Try again later."
6. Walter finally opens the app, accepts Xime, and rejects Yani.
7. Zoe can now send her request.

---

### Scenario J: Multi-User Trip Coordination

> **Full lifecycle with multiple passengers, messaging, and ratings**

1. **Driver Ale** creates a Rosario → Córdoba trip, 3 seats, $8000/seat.
2. **Bea** requests → Ale accepts. Bea messages: "Can you stop at the highway gas station?"
3. **Cami** requests → Ale accepts. Cami messages: "I'll be at the main plaza."
4. **Dani** requests → Ale accepts (last seat). Everyone gets "Trip is full" message.
5. **Emi** tries to request → sees no seats available.
6. Bea cancels the day before due to an emergency. Seat reopens.
7. Emi sees the seat is now available, requests, and Ale accepts.
8. Trip day: Ale picks up Cami at the plaza, then Emi, stops at the gas station for Bea's replacement (Emi).
9. After the trip:
   - Ale rates Cami (positive) and Emi (positive).
   - Cami rates Ale (positive): "Great driver, comfortable car."
   - Emi rates Ale (positive): "Very punctual."
   - Bea, who canceled, does not get a rating prompt (she was not on the trip).
10. Ale's positive rating count increases, making future trips more attractive to passengers.
