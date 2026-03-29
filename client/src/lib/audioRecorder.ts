/**
 * AudioRecorder — captures audio from a MediaStream using the MediaRecorder API.
 *
 * Usage:
 *   const recorder = new AudioRecorder();
 *   recorder.start(stream);
 *   // ... later ...
 *   const blob = await recorder.stop();  // audio/webm;codecs=opus
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private _isRecording = false;

  /**
   * Start recording from the given MediaStream.
   * If already recording, this is a no-op.
   */
  start(stream: MediaStream): void {
    if (this._isRecording) return;

    this.chunks = [];

    // Prefer opus in webm; fall back to whatever the browser supports
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

    this.mediaRecorder = new MediaRecorder(stream, {
      ...(mimeType ? { mimeType } : {}),
    });

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    // Collect data every second so we don't lose everything on an abrupt stop
    this.mediaRecorder.start(1000);
    this._isRecording = true;
  }

  /**
   * Stop recording and return the captured audio as a single Blob.
   * Resolves with audio/webm blob (or whatever mimeType was negotiated).
   */
  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this._isRecording) {
        reject(new Error('Not recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.chunks, { type: mimeType });
        this.chunks = [];
        this._isRecording = false;
        this.mediaRecorder = null;
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  /** Whether recording is currently in progress. */
  isRecording(): boolean {
    return this._isRecording;
  }
}
