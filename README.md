# bookcat-api

A Node.js and Express backend app, built up one session at a time for **BED OCT26** (Backend Development, Ngee Ann Polytechnic).

This repository is a **reference for the teaching team and for students**. The code you see here is exactly what was built in class, up to the most recent session taught.

## How the repo is organised

There is one branch, `main`, and each session ends at a **tag**. A tag is a labelled snapshot of the whole project at that moment.

Each session has an IPL (the 3-hour class) and an OAL (the 1-hour online work before the next class).

| Tag | What the code looks like |
|---|---|
| `s01-oal-end` | Node, npm and Express running. `GET /` and `GET /categories` (a hardcoded array). This is also the starting point for Session 2. |
| `s02-ipl-end` | The live-coded routes against the NP Bookstore `Author` table: `GET /authors`, `GET /authors/:id`, `POST`, `PUT` and `DELETE`, each with `try / catch / finally`, `parseInt`, bound inputs and the right status code. |
| `s02-oal-end` | Settings move into a `.env` file (`dotenv`, `.env.example`, `.env` in `.gitignore`). Adds `docs/api-contract-authors.md`, a worked API contract table. This is also the starting point for Session 3. |

More tags are added here as each session is taught.

## Run it

You need Node.js installed. It comes with npm.

The `node_modules` folder is **not** in this repo. It is listed in `.gitignore` because it is large and npm can rebuild it. A fresh clone will not run until you install the modules.

```bash
git clone <this repo's URL>
cd bookcat-api
npm install
npm start
```

`npm install` reads `package.json` and downloads every module the project needs into a new `node_modules` folder. Run it again each time you check out a different tag, because the list of modules grows as the course goes on.

| Module | What it does | Needed from |
|---|---|---|
| `express` | The web framework: routes, requests and responses | `s01-oal-end` |
| `mssql` | Connects to SQL Server and runs queries | `s02-ipl-end` |
| `dotenv` | Loads the settings in `.env` into `process.env` | `s02-oal-end` |

If you are building the project yourself in an empty folder instead of cloning, create `package.json` first and then install the modules by name:

```bash
npm init -y
npm install express mssql dotenv
```

If you see `Error: Cannot find module 'express'` (or another module name), you have not run `npm install` in this folder yet. Run it and try again.

From Session 2 onward the routes need the **NP Bookstore** database on your own SQL Server.

- Until `s02-oal-end`, put your own login in `dbConfig.js`.
- From `s02-oal-end` onward, copy `.env.example` to `.env` and put your login there. `.env` is ignored by git. Never commit a real password.

Then open <http://localhost:3000/> in a browser. The files in `requests/` list the requests for each session.

## Look at a session, or live-code it

You do not need to be a collaborator, and you cannot push to this repo. Clone it and work on your own copy.

```bash
# See the code exactly as it was at the end of a session (read-only view)
git checkout s01-oal-end

# Start a session live, from where the previous one ended
git switch -c my-demo s01-oal-end

# See what changed between two points
git diff s01-oal-end s02-ipl-end

# Return to the latest code
git switch main
```

You can also download any tag as a zip from the repository's **Releases** or **Tags** page on GitHub.

## Conventions

- The database is **NP Bookstore** (SQL Server).
- CommonJS (`require`), not ES modules.
- Every response uses `res.status(code).json({ ... })`. The only exception is DELETE, which sends `res.status(204).send()`.
- Ids and numeric query values are converted with `parseInt`.
