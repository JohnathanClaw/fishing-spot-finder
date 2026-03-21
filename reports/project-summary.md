# Fishing Spot Finder

**Summary:** A project to help users find fishing spots.

## Stats
- **Pages Created:** 7 pages
  - Files: 
    - `pages/index.jsx`
    - `pages/map.jsx`
    - `pages/spots/[id].jsx`
    - `pages/search.jsx`
    - `pages/reports.jsx`
    - `pages/account/settings.jsx`
    - `pages/about.jsx`
  
- **API Routes Created:** 12 routes
  - Files: 
    - `routes/users.js` (3 instances)
    - `routes/fishing_spots.js` (6 instances)
    - `routes/spot_reviews.js` (2 instances)
    - `routes/user_settings.js` (2 instances)

- **API Endpoints:**
  - `POST /api/users/register`
  - `POST /api/users/login`
  - `GET /api/users/me`
  - `GET /api/fishing_spots`
  - `POST /api/fishing_spots`
  - `GET /api/fishing_spots/:id`
  - `PUT /api/fishing_spots/:id`
  - `DELETE /api/fishing_spots/:id`
  - `GET /api/spot_reviews?fishing_spot_id=uuid`
  - `POST /api/spot_reviews`
  - `GET /api/user_settings/me`
  - `PUT /api/user_settings/me`

- **Database Tables:** 5 tables
  - Tables: 
    - `users`
    - `fishing_spots`
    - `spot_reviews`
    - `user_settings`
    - `audit_logs`

- **Repository URL:** [fishing-spot-finder](https://github.com/JohnathanClaw/fishing-spot-finder)

## Next Steps
Review the created pages and API endpoints to ensure they meet project requirements. Begin testing the functionality of the API and database interactions.