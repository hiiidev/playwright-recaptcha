import { spawn } from 'child_process';

export type AudioTranscriber = (audioBuffer: Buffer, language: string) => Promise<string | null>;

const DEFAULT_GOOGLE_KEY = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';

/**
 * Transcode an MP3 buffer into 16kHz mono FLAC using ffmpeg.
 */
export async function convertMp3ToFlac(
  mp3Buffer: Buffer,
  ffmpegPath: string = 'ffmpeg'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, [
      '-y',
      '-i', 'pipe:0',
      '-ar', '16000',
      '-ac', '1',
      '-f', 'flac',
      'pipe:1'
    ]);

    const chunks: Buffer[] = [];
    const errors: Buffer[] = [];

    proc.stdout.on('data', (data: Buffer) => {
      chunks.push(data);
    });

    proc.stderr.on('data', (data: Buffer) => {
      errors.push(data);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        const errMsg = Buffer.concat(errors).toString('utf-8');
        reject(new Error(`FFmpeg exited with code ${code}: ${errMsg}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });

    proc.stdin.write(mp3Buffer);
    proc.stdin.end();
  });
}

/**
 * Transcribe FLAC audio using the Google Speech Recognition API (matching Python speech_recognition).
 */
export async function transcribeWithGoogle(
  flacBuffer: Buffer,
  language: string = 'en-US',
  apiKey: string = DEFAULT_GOOGLE_KEY
): Promise<string | null> {
  const url = `https://www.google.com/speech-api/v2/recognize?client=chromium&lang=${encodeURIComponent(
    language
  )}&key=${apiKey}&pFilter=0`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/x-flac; rate=16000',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: flacBuffer,
  });

  if (!res.ok && res.status !== 200) {
    return null;
  }

  const responseText = await res.text();

  for (const line of responseText.split('\n')) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      if (Array.isArray(data.result) && data.result.length > 0) {
        const alternatives = data.result[0].alternative;
        if (Array.isArray(alternatives) && alternatives.length > 0) {
          const transcript = alternatives[0].transcript;
          if (typeof transcript === 'string' && transcript.length > 0) {
            return transcript;
          }
        }
      }
    } catch {
      // Streamed or uncompleted JSON lines can be ignored
    }
  }

  return null;
}
