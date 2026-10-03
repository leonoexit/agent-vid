// Small ffmpeg helpers for voice clips: length, silent spans, and cutting a piece out of a take.
import { execFileSync, spawnSync } from "node:child_process";

/** Length of a media file in seconds (ffprobe). */
export const mediaSeconds = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }));

/** Silent spans [[start, end]] of at least `minLen` seconds (ffmpeg silencedetect at `noise` dB). */
export function silences(file, { minLen = 0.15, noise = -35 } = {}) {
  const log = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", `silencedetect=noise=${noise}dB:d=${minLen}`, "-f", "null", "-"],
    { encoding: "utf8" }).stderr;
  const st = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, Number(m[1])));
  const en = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  if (st.length > en.length) en.push(mediaSeconds(file)); // silence that runs to the end of the file
  return st.map((s, i) => [s, en[i]]);
}

/** Writes [from, to) of `src` to `out` as 48 kHz mono WAV, with 8 ms fades so a cut never clicks. */
export function cutClip(src, from, to, out) {
  const d = Math.max(0.02, to - from);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", from.toFixed(3), "-t", d.toFixed(3), "-i", src,
    "-af", `afade=t=in:d=0.008,afade=t=out:st=${(d - 0.008).toFixed(3)}:d=0.008`, "-ar", "48000", "-ac", "1", out]);
}
