# Spotify Revised

Attempt to improve the Spotify browsing experience, especially for people who like to listen to full albums instead of single random songs.

## Getting Started

Before you can run this locally you need to do a couple of things.

1. Setup Spotify app by going to your [Spotify Developer's Dashboard](https://developer.spotify.com/dashboard/applications) and clicking "Create an App"
2. Fill in information and when asked for redirect uri enter: `http://localhost:3000/auth`
3. Clone this repository locally
4. Have Node.js and npm installed
5. Run `npm install` in cloned folder
6. Copy `.env` to `.env.local`
7. In `.env.local` fill in you Spotify application's `CLIENT_ID`

## Running the project

From the project's root folder run the following command:

```
npm start
```
