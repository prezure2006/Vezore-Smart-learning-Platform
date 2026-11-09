# Vezore — Development Documentation

**Project:** Vezore — Intelligent Video Platform  
**Development approach:** Learning by building, debugging, and implementing independently  
**Frontend:** React + Vite + JavaScript  
**Backend:** Node.js + Express.js  
**Database:** MongoDB + Mongoose  
**Video storage:** Cloudinary  
**Audio processing:** FFmpeg  
**Speech recognition:** Groq API + Whisper Large V3

---

## Project Overview

Vezore is a video platform that allows users to upload, store, watch, edit, and delete videos. The goal is to extend it with AI-powered capabilities, including automatic speech transcription and timestamped transcripts.

The project is being developed incrementally. Instead of building everything at once, each feature is implemented, tested, debugged, and understood before moving to the next one.

## Mistakes, Debugging and How They Were Fixed

One of the most valuable parts of building Vezore was debugging real problems.

| Problem / mistake                                       | Why it happened                                                  | How it was fixed                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Cloudinary upload dependency conflict                   | Incompatible package peer dependencies                           | Resolved the Cloudinary and storage package version conflict                           |
| `LIMIT_UNEXPECTED_FILE`                                 | Multipart field name did not match Multer configuration          | Used the correct field name `video`                                                    |
| Mongoose validation error for duration                  | Duration was required but not supplied                           | Made duration optional with a default value                                            |
| Video not appearing in frontend                         | API data had not been fetched and mapped correctly               | Integrated GET API with `useEffect` and `map()`                                        |
| EditPage route error                                    | Component was placed directly inside Routes                      | Used the `element` prop inside a Route                                                 |
| `Cannot read properties of undefined (reading 'title')` | Request data was sent in Postman Params instead of Body          | Sent JSON through Body → raw → JSON                                                    |
| Wrong description property                              | Read `data.video.descr` instead of `data.video.description`      | Corrected the property name                                                            |
| JSX input error                                         | Input was written with closing content                           | Used self-closing input syntax                                                         |
| React form submission issue                             | Event handler was being invoked instead of passed as a reference | Used `onSubmit={handleSubmit}`                                                         |
| FFmpeg could not find audio stream                      | Initial extraction attempt failed                                | Inspected the actual media streams with FFprobe and tested the FFmpeg command manually |
| Windows invalid file path                               | Incorrectly constructed command path                             | Used correctly quoted paths and relative paths from the server directory               |
| Audio extraction integration issue                      | Needed to verify the path and FFmpeg arguments inside Node       | Added logging and verified the generated file                                          |
| Transcription testing uncertainty                       | Audio processing and API integration were separate steps         | Tested Groq independently before integrating it into the route                         |

| POST | because didnt gave the post in the fetch function | By adding a post in the featch function |
| ---- | ------------------------------------------------- | --------------------------------------- |

### Debugging lessons

1. Read the actual error instead of randomly changing code.
2. Verify whether the problem is in the frontend, backend, database, external service, or file system.
3. Test individual components independently before combining them.
4. Use console logs to inspect important values and file paths.
5. Use Postman to test backend routes independently of React.
6. Use FFprobe to inspect media instead of assuming the audio stream exists.
7. Check request headers, body format, URL parameters, and multipart field names.
8. Understand what a function receives and returns before connecting it to another function.
9. When we want both try and catch can have the access of a varible we should decleare the variable outiside
10. We use status of som varible to check wether it is fetched or not so dont forget to use that while sending the result.
11. Javascript uses lowercase boolean values like true and false not True and False
12. fetch() returns a Response object.
    .ok tells you whether the HTTP status is successful.
    .json() parses the response body.
    .json() is asynchronous, so use await

---

## Current Project Status

### Completed

- [x] React + Vite frontend.
- [x] Express backend.
- [x] MongoDB connection.
- [x] Cloudinary integration.
- [x] Video upload.
- [x] Video metadata storage.
- [x] Thumbnail generation.
- [x] Get all videos.
- [x] Get single video.
- [x] Delete video.
- [x] Update video information.
- [x] Video listing frontend.
- [x] Video playback page.
- [x] Upload page.
- [x] Edit page.
- [x] FFmpeg installation.
- [x] Audio extraction and conversion.
- [x] Groq Whisper integration.
- [x] End-to-end transcription API.
- [x] Transcription is loading in the frontend
- [x] Allow users to click a transcript segment and jump to its timestamp in the video.
- [x] Transcript UI improvements

## Next Development Milestone

- [] Transcript search
- [] Transcript utilities
- [] Video summary
- []Ask AI
- [] Final UI and polish

## What This Project Has Taught Me

Vezore has helped me understand how a real full-stack application is assembled.

I learned that building software is not just writing components or API routes. It involves designing data structures, managing files, connecting external services, handling asynchronous operations, debugging failures, and thinking about how different parts of a system communicate.

The AI functionality also taught me that using an AI model is only one part of an AI application. Before the model can do its job, the application must prepare the data, process it, send it correctly, and handle the result.

**My development principle:** Build one feature, understand its workflow, test it, debug it, and then move forward. Functionality first, AI capabilities next, and UI polish last.
