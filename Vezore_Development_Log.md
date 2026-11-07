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

## Day 1 — Project Foundation and Backend Setup

### Objectives

- Understand the project architecture.
- Set up the Express backend.
- Establish communication between frontend and backend.

### Work completed

1. Created the Vezore project structure.
2. Set up the React frontend using Vite.
3. Initialized the Node.js backend.
4. Installed essential dependencies:
   - Express
   - CORS
   - dotenv
   - Mongoose
   - Nodemon
5. Created the main server file: `server.js`.
6. Added a health-check endpoint: `/api/health`.
7. Configured CORS to allow requests from the frontend running at `http://localhost:5173`.
8. Configured the frontend API base URL using an environment variable.

### Important concepts learned

- What a backend server does.
- How frontend and backend communicate through HTTP requests.
- Why CORS is required.
- Why environment variables are used.
- How Nodemon helps during development.

---

## Day 2 — MongoDB Connection and Cloudinary Integration

### Objectives

- Connect the backend to MongoDB.
- Configure external video storage.
- Implement video uploading.

### Work completed

**MongoDB**

1. Installed and configured MongoDB.
2. Created a database connection file: `config/db.js`.
3. Connected to the local database:

`mongodb://127.0.0.1:27017/intelligent-video-platform`

4. Configured the server to start after the database connection succeeds.

**Cloudinary**

1. Created a Cloudinary account.
2. Configured Cloudinary credentials through environment variables.
3. Created `config/cloudinary.js`.
4. Installed Multer for handling multipart file uploads.
5. Used Multer memory storage to receive uploaded video files.
6. Installed Streamifier to stream the uploaded buffer to Cloudinary.
7. Created the video upload route.

### Upload endpoint

`POST /api/videos/upload`

The endpoint accepts a multipart form-data request with the field name `video`.

### Important concepts learned

- MongoDB database connections.
- Cloudinary as external media storage.
- Multer and multipart/form-data.
- File buffers and streams.
- Why large media files should not be stored directly in MongoDB.

---

## Day 3 — Video Metadata and CRUD API

### Objectives

- Store uploaded video information in MongoDB.
- Implement APIs to retrieve, update, and delete videos.

### Work completed

**Mongoose model**

Created `models/video.models.js` with fields such as:

- title
- description
- videoUrl
- publicId
- size
- duration
- thumbnailURL

**Upload metadata**

After uploading a video to Cloudinary, the backend saves its metadata in MongoDB.

The Cloudinary response provides important information such as the secure video URL, public ID, and file size.

**Thumbnail generation**

Generated a thumbnail URL from the Cloudinary video URL using Cloudinary URL transformations.

**GET all videos**

`GET /api/videos/all`

Retrieves all video documents from MongoDB.

**GET single video**

`GET /api/videos/:id`

Uses the MongoDB document ID to retrieve a specific video.

**DELETE video**

`DELETE /api/videos/delete/:id`

The backend:

1. Finds the video document.
2. Retrieves its Cloudinary public ID.
3. Deletes the video from Cloudinary.
4. Deletes the corresponding MongoDB document.

**UPDATE video information**

`PUT /api/videos/updateinfo/:id`

Updates the video's title and description.

### Important concepts learned

- Mongoose schemas and models.
- MongoDB document IDs.
- CRUD operations.
- HTTP methods: GET, POST, PUT, DELETE.
- Cloudinary public IDs.
- How external storage and database records work together.

---

## Day 4 — Frontend Architecture and API Integration

### Objectives

- Build the frontend structure.
- Display videos dynamically.
- Connect frontend components to backend APIs.

### Work completed

1. Created Navbar and Sidebar components.
2. Created a MainLayout component.
3. Built the VideoCard component.
4. Built the VideoGrid component.
5. Used React `useEffect` to fetch videos from the backend.
6. Used React `useState` to store the fetched video list.
7. Used JavaScript `.map()` to render video cards dynamically.
8. Integrated React Router.

### Routing implemented

- `/` — Main video page.
- `/watch/:id` — Individual video page.
- `/edit/:id` — Video editing page.

### Watch page

The WatchPage:

1. Extracts the video ID using `useParams()`.
2. Fetches the corresponding video from the backend.
3. Displays its title and description.
4. Plays the video using the HTML `<video>` element.

### Upload page

Created an upload form with:

- Title input.
- Description input.
- Video file input.
- Loading state.
- Success and error feedback.

Used FormData to send the video and metadata to the backend.

### Delete functionality

Implemented deletion from the frontend.

The VideoGrid owns the video state and handles the API request. It passes a callback to VideoCard, which invokes that callback when the user clicks Delete.

### Edit functionality

Created an EditPage that:

1. Extracts the video ID from the URL.
2. Fetches existing video information.
3. Displays the data in controlled form fields.
4. Sends an update request using PUT.

### Important concepts learned

- React components and props.
- State management with `useState`.
- Side effects with `useEffect`.
- Parent-child communication.
- Lifting state up.
- Controlled inputs.
- React Router and URL parameters.
- Fetch API and FormData.

---

## Day 5 — FFmpeg and Audio Processing

### Objectives

- Understand how to extract audio from uploaded videos.
- Prepare audio for speech recognition.
- Learn the basic concepts of audio processing.

### FFmpeg installation

Installed a precompiled FFmpeg Windows build and added its `bin` directory to the Windows PATH.

Verified the installation using:

`ffmpeg -version`

Also learned about FFprobe, which is used to inspect media information.

### Media inspection

Inspected an MP4 video using FFprobe.

Learned about:

- MP4 as a container.
- H.264 as a video codec.
- AAC as an audio codec.
- Resolution.
- Frames per second.
- Audio sample rate.
- Stereo audio channels.

### Extracting audio

First extracted the original AAC audio without re-encoding:

`ffmpeg -i "./prash.mp4" -vn -acodec copy "./prash_audio.aac"`

Then converted the audio into WAV:

`ffmpeg -i "./prash.mp4" -vn -ac 1 -ar 16000 -c:a pcm_s16le "./prash_audio.wav"`

### Meaning of the FFmpeg arguments

- `-i`: Input file.
- `-vn`: Exclude video.
- `-ac 1`: Convert audio to one channel (mono).
- `-ar 16000`: Set the sample rate to 16,000 Hz.
- `-c:a pcm_s16le`: Encode audio as 16-bit PCM.
- WAV: Convenient container for uncompressed PCM audio.

### Important concepts learned

- Difference between a codec and a container.
- Audio extraction.
- Sample rate.
- Mono versus stereo.
- Compressed versus uncompressed audio.
- Why standardized audio input is useful for speech recognition.

---

## Day 6 — Groq Whisper API Integration

### Objectives

- Connect a speech recognition model to the backend.
- Convert audio into text.
- Retrieve timestamped transcript segments.

### Work completed

1. Created a Groq account.
2. Generated an API key.
3. Stored the key in the server environment variables.
4. Installed `groq-sdk`.
5. Created a standalone transcription test.
6. Used the Whisper Large V3 model.

### Transcription configuration

Used the Groq audio transcription endpoint with:

- Model: `whisper-large-v3`
- Response format: `verbose_json`

The verbose JSON response provides:

- Complete transcript text.
- Timestamped segments.
- Segment start times.
- Segment end times.
- Individual segment text.

### Important concepts learned

- API keys and environment variables.
- SDK integration.
- Speech-to-text processing.
- Asynchronous API requests.
- JSON responses.
- Timestamped transcription.

---

## Day 7 — Complete AI Transcription Pipeline Integration

### Objectives

- Integrate Cloudinary, FFmpeg, and Groq into one backend workflow.
- Generate transcripts from uploaded videos.

### Architecture implemented

The transcription endpoint:

`POST /api/videos/:id/transcribe`

The workflow:

1. Receives the video ID from the URL.
2. Finds the video document in MongoDB.
3. Retrieves its Cloudinary video URL.
4. Downloads the video into the server's temporary folder.
5. Uses FFmpeg to extract and convert the audio.
6. Sends the WAV file to Groq Whisper.
7. Receives transcript text and timestamped segments.
8. Returns the transcription result in the API response.

### Utility files created

**`utils/downloadVideo.js`**

Downloads a video from Cloudinary and saves it locally.

**`utils/extractAudio.js`**

Uses FFmpeg through Node.js `child_process.execFile` to extract and convert audio.

**`utils/transcribeAudio.js`**

Uses the Groq SDK to send the audio file to Whisper and return the transcription.

### Important concepts learned

- Node.js native fetch.
- Readable streams.
- File system operations.
- `stream/promises` and pipeline.
- Child processes.
- Promisifying callback-based functions.
- Modular backend architecture.
- Connecting multiple services into one processing pipeline.

### Result

Successfully tested the complete pipeline using Postman.

The endpoint returned the expected transcript:

"The greatest pleasure I've had is trying to do something that everybody says could not be done."

It also returned timestamped segments.

**Milestone achieved: End-to-end AI speech transcription is working.**

---

## Day 8 — [Feature / Milestone Name]

Objective

What am I trying to build and why?

Implementation

What I implemented.

Files created or modified.

APIs, functions, or components added.

Concepts learned

Concept 1

Concept 2

Problems encountered

Problem: What went wrong?

Reason: Why did it happen?

Solution: How did I debug and fix it?

Testing

How I tested the feature.

Expected result.

Actual result.

Outcome

What works now? What is still incomplete?

Next steps

Next task 1

Next task 2

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

### In progress

- [ ] Save the complete transcript in MongoDB.
- [ ] Save timestamped transcript segments in MongoDB.
- [ ] Implement transcription status tracking.
- [ ] Handle failed transcription states properly.
- [ ] Clean up temporary video and audio files.
- [ ] Build the transcript interface on the frontend.
- [ ] Allow users to click a transcript segment and jump to its timestamp in the video.

---

## Next Development Milestone

### Persist transcription results

Update the existing Video Mongoose schema with:

- `transcript`: String.
- `segments`: Array of objects containing `start`, `end`, and `text`.
- `transcriptionStatus`: String with allowed values:
  - `pending`
  - `processing`
  - `completed`
  - `failed`

Then update the transcription route to:

1. Set status to `processing`.
2. Download the video.
3. Extract the audio.
4. Request transcription from Groq.
5. Save the transcript and segments.
6. Set status to `completed`.
7. If an error occurs, set status to `failed` and return an appropriate HTTP error response.

After persistence works, build the frontend transcript viewer.

---

## What This Project Has Taught Me

Vezore has helped me understand how a real full-stack application is assembled.

I learned that building software is not just writing components or API routes. It involves designing data structures, managing files, connecting external services, handling asynchronous operations, debugging failures, and thinking about how different parts of a system communicate.

The AI functionality also taught me that using an AI model is only one part of an AI application. Before the model can do its job, the application must prepare the data, process it, send it correctly, and handle the result.

**My development principle:** Build one feature, understand its workflow, test it, debug it, and then move forward. Functionality first, AI capabilities next, and UI polish last.

Situation HTTP status
Video doesn't exist 404
Transcription pending 202
Transcription processing 202
Transcription completed 200
Transcription failed 200
