const express = require('express');
const app = express();
const port = 9000;

// Start streaming RTSP to RTMP
const ffmpeg = require('fluent-ffmpeg');
const ffmpegProcess = ffmpeg('rtsp://admin:Florenza2026@36.255.85.5:554/Streaming/Channels/101')
  .inputOptions([
    '-rtsp_transport tcp', // Use TCP to avoid UDP packet loss
  ])
  .outputOptions([
    '-f flv',              // Output format for RTMP
    '-c:v libx264',        // Video codec
    '-preset veryfast',    // FFMpeg preset
    '-g 50',               // Group of pictures (keyframe interval)
    '-crf 23',             // Constant Rate Factor for quality (lower is better, range 0-51)
  ])
  .output('rtmp://localhost/live/stream')
  .on('start', () => {
    console.log('FFmpeg process started');
  })
  .on('error', (err) => {
    console.error('Error processing stream: ' + err.message);
  });

ffmpegProcess.run();

// Serve HLS stream to clients
app.use('/hls', express.static('media/live/stream'));

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.redirect('/hls/stream.m3u8');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
