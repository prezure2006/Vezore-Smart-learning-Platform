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

## Day 8 — [Transcript Generation and Showing to in frontend]

### Objective

-client on watchPage showing the transcript generated form groq Wispher
-implementing the post api and get api for first generating transcribe and storing ti in the db and the retriving it to the frontend

### Implementation

- Implemented the api **`/:id/transcribe`** for generating the trascript[post]
- Implemented the api **`/:id/transcript`** for retriving the trascript[get]
- Implemented a button for generating, showing and hiding the genertaed transcript
- Existing transcript loads automatically but stays hidden.
- Show Transcript displays it.
- Hide Transcript collapses it.
- New video can generate a transcript.
- Newly generated transcript appears automatically.
- Failed transcription allows retry

### Result

- Can generate the transcript now through groq api calling and show in the react forntend

## Day 9 - [Showing List of the timeline from where users can Change the video timeline ]

## Objective

- Client should see a generated list off the timeline from which they can go to any time point in the video they want and it is beneficial when you try to fidn topics of you necessity

## Implementation

- Got the segments from the backend through the get api and then used segments .map() on it and should each of them used a ul and inside a button where we get onclick
  -Inside the onclick added a seekTo funtion through which the user can seek to its required time point and also learnt useRef today

## Result

- Now the user can seek TO any point of time of the video timeline

Was not able to do much today But yeah this much is enough now moving towards the next day
