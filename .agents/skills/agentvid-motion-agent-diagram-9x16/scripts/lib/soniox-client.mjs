// Minimal Soniox client: text-to-speech (tts-rt-v2) and async speech-to-text with word timings.
// Docs: https://soniox.com/docs/tts/rest-api/generate-speech and https://soniox.com/docs (stt async).
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { requireKey } from "./load-api-keys.mjs";

const API = "https://api.soniox.com/v1";
const auth = () => ({ Authorization: `Bearer ${requireKey("SONIOX_API_KEY")}` });

async function call(method, url, body, headers = {}) {
  const res = await fetch(url, { method, body, headers: { ...auth(), ...headers } });
  if (!res.ok) throw new Error(`Soniox ${method} ${url.replace(API, "")} -> HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}
const json = async (method, path, payload) =>
  (await call(method, API + path, payload && JSON.stringify(payload), { "Content-Type": "application/json" })).json();

/** Synthesises `text` to a 48 kHz WAV file. Every Soniox voice speaks every supported language. */
export async function sonioxSpeak({ text, voice = "Adrian", language = "en", out, model = "tts-rt-v2" }) {
  const body = JSON.stringify({ model, voice, language, text, audio_format: "wav", sample_rate: 48000 });
  const res = await call("POST", "https://tts-rt.soniox.com/tts", body, { "Content-Type": "application/json" });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  return out;
}

/**
 * Transcribes `file` and returns words [{ t, s, e }] in seconds. `context` (the script text) biases
 * recognition towards the exact spelling of product names. Remote file + transcription are deleted after.
 */
export async function sonioxWords({ file, language, context }) {
  const form = new FormData();
  form.append("file", new Blob([readFileSync(file)]), basename(file));
  const { id: fileId } = await (await call("POST", `${API}/files`, form)).json();
  let transcriptionId;
  try {
    ({ id: transcriptionId } = await json("POST", "/transcriptions", {
      file_id: fileId, model: "stt-async-v5", language_hints: [language], context: { text: context },
    }));
    for (let i = 0; ; i++) {
      const { status, error_message } = await json("GET", `/transcriptions/${transcriptionId}`);
      if (status === "completed") break;
      if (status === "error") throw new Error(`Soniox transcription failed: ${error_message}`);
      if (i > 300) throw new Error("Soniox transcription timed out");
      await new Promise((r) => setTimeout(r, 1000));
    }
    const { tokens } = await json("GET", `/transcriptions/${transcriptionId}/transcript`);
    const words = [];
    for (const tok of tokens) {
      // A token that starts with a space opens a new word; others continue the current one.
      if (!words.length || tok.text.startsWith(" ")) words.push({ t: tok.text.trim(), s: tok.start_ms / 1000, e: tok.end_ms / 1000 });
      else Object.assign(words.at(-1), { t: words.at(-1).t + tok.text, e: tok.end_ms / 1000 });
    }
    // "workflows—cleanup": recognition joins words with dashes; split them and share the time by length
    const split = words.flatMap((w) => {
      const parts = w.t.split(/[—–]/).filter(Boolean);
      if (parts.length < 2) return [w];
      const total = parts.reduce((n, p) => n + p.length, 0);
      let s = w.s;
      return parts.map((t) => {
        const d = ((w.e - w.s) * t.length) / total;
        const piece = { t, s, e: s + d };
        s += d;
        return piece;
      });
    });
    return split.filter((w) => /[\p{L}\p{N}]/u.test(w.t));
  } finally {
    if (transcriptionId) await call("DELETE", `${API}/transcriptions/${transcriptionId}`).catch(() => {});
    await call("DELETE", `${API}/files/${fileId}`).catch(() => {});
  }
}
