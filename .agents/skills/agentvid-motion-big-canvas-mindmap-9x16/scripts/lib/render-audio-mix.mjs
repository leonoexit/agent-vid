// Final audio: music (ducked by the voice bus) + voice lines + SFX -> loudness-normalised assets/audio/mix.m4a,
// plus a per-frame voice envelope (0..1) that drives mouths and waveforms in the composition.
// Mix targets measured on the reference videos: music ~5 dB under speech, -14 LUFS, true peak <= -1.5 dBTP.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { ensureDir, round } from "./project-io.mjs";

const FMT = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo";
const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-nostats", "-y", ...args], { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });
const stderrOf = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8" }).stderr;

function gainTo(file, target) {
  const log = stderrOf(["-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const sum = log.slice(log.lastIndexOf("Summary"));
  const I = Number(/I:\s+(-?[\d.]+) LUFS/.exec(sum)[1]);
  const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(sum)[1]);
  return Math.min(target - I, -1 - peak); // never push a peak above -1 dBFS
}

/** Mix dir for temp files and stems; measure-mix-balance.py reads the stems from here. */
export const mixWorkDir = (root) => ensureDir(join(tmpdir(), `${basename(root)}-mix`));

export function voiceEnvelope(smp, duration, fps) {
  const rms = Array.from({ length: Math.round(duration * fps) }, (_, f) => {
    const start = Math.floor(f * 24000 / fps);
    const end = Math.min(smp.length, Math.floor((f + 1) * 24000 / fps));
    let sum = 0;
    for (let i = start; i < end; i++) sum += smp[i] * smp[i];
    return end > start ? Math.sqrt(sum / (end - start)) : 0;
  });
  const sorted = rms.filter((x) => x > 0.005).sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.9)] || 1;
  return rms.map((x) => round(Math.min(1, x / ref), 2));
}

export function renderAudioMix(root, { scenes, sfxEvents, grid, stems }) {
  const { cfg, arrangement } = grid;
  const D = cfg.duration;
  const work = mixWorkDir(root);
  const inputs = [join(root, arrangement?.output || "assets/audio/music/bgm.flac")];
  if (!existsSync(inputs[0])) throw new Error(`missing music ${inputs[0]} — run arrange-music (or copy your track there)`);
  // music is normalised to -16 LUFS like the voice, then sits cfg.musicDb below it before ducking
  const musicGain = (file) => (gainTo(file, -16) + cfg.musicDb).toFixed(2);
  const g = [`[0:a]${FMT},atrim=0:${D},volume=${musicGain(inputs[0])}dB[main]`];
  const outroFile = join(root, "assets/audio/music/outro-raw.mp3");
  if (cfg.outroBed != null && existsSync(outroFile)) {
    inputs.push(outroFile);
    g.push(`[1:a]${FMT},volume=${musicGain(outroFile)}dB,afade=t=in:d=2.5,adelay=delays=${Math.round(cfg.outroBed * 1000)}:all=1[bed]`);
    g.push("[main][bed]amix=inputs=2:normalize=0:dropout_transition=0[mus]");
  } else g.push("[main]anull[mus]");

  const vo = [];
  for (const s of scenes) {
    const file = join(root, "assets/audio/vo", `${s.id}.wav`);
    const idx = inputs.push(file) - 1;
    const outs = s.lines.map((_, i) => `[v${idx}_${i}]`);
    g.push(`[${idx}:a]${FMT},volume=${gainTo(file, -16).toFixed(2)}dB,asplit=${outs.length}${outs.join("")}`);
    s.lines.forEach((l, i) => {
      const len = (l.seg.b - l.seg.a) / l.tempo;
      const tempo = l.tempo !== 1 ? `,atempo=${l.tempo}` : "";
      g.push(`[v${idx}_${i}]atrim=start=${l.seg.a.toFixed(4)}:end=${l.seg.b.toFixed(4)},asetpts=PTS-STARTPTS${tempo},` +
        `afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, len - 0.05).toFixed(4)}:d=0.05,adelay=delays=${Math.round(l.place * 1000)}:all=1[vl${idx}_${i}]`);
      vo.push(`[vl${idx}_${i}]`);
    });
  }
  g.push(`${vo.join("")}amix=inputs=${vo.length}:normalize=0:dropout_transition=0,asplit=${stems ? 4 : 3}[vobus][voside][voenv]${stems ? "[vostem]" : ""}`);
  // sidechaincompress stops output when its key input ends, so the voice key is padded to the full length;
  // without it the music vanishes after the last spoken line (measured: music gone from ~5 s on).
  g.push(`[voside]apad=whole_dur=${D}[vokey]`);
  const duck = "sidechaincompress=threshold=0.03:ratio=3:attack=15:release=350:makeup=1";
  g.push(stems ? `[mus][vokey]${duck},asplit=2[musd][musstem]` : `[mus][vokey]${duck}[musd]`);

  const fx = [];
  const byFile = new Map();
  for (const e of sfxEvents) byFile.set(e.sfx, [...(byFile.get(e.sfx) || []), e]);
  for (const [id, evs] of byFile) {
    const file = join(root, "assets/audio/sfx", `${id}.mp3`);
    if (!existsSync(file)) throw new Error(`missing SFX ${file} — run generate-sfx-and-music sfx`);
    const idx = inputs.push(file) - 1;
    const outs = evs.map((_, i) => `[x${idx}_${i}]`);
    g.push(`[${idx}:a]${FMT},volume=${gainTo(file, -16).toFixed(2)}dB,asplit=${outs.length}${outs.join("")}`);
    evs.forEach((e, i) => (g.push(`[x${idx}_${i}]volume=${e.vol},adelay=delays=${Math.round(e.t * 1000)}:all=1[xl${idx}_${i}]`), fx.push(`[xl${idx}_${i}]`)));
  }
  g.push(`[musd][vobus]${fx.join("")}amix=inputs=${2 + fx.length}:normalize=0:dropout_transition=0,` +
    `afade=t=out:st=${D - cfg.fadeOut}:d=${cfg.fadeOut},atrim=0:${D},apad=whole_dur=${D}[out]`);
  g.push(`[voenv]pan=mono|c0=0.5*c0+0.5*c1,aresample=24000,apad=whole_dur=${D},atrim=0:${D}[env]`);

  const graphFile = join(work, "mix-graph.txt");
  writeFileSync(graphFile, g.join(";\n"));
  const premix = join(work, "premix.wav");
  const envRaw = join(work, "vo-env.f32");
  const stemOut = stems ? ["-map", "[musstem]", "-c:a", "pcm_s16le", join(work, "stem-music.wav"), "-map", "[vostem]", "-c:a", "pcm_s16le", join(work, "stem-voice.wav")] : [];
  // float premix: a hot music bed can sum above 0 dBFS here and 16-bit would hard-clip it before normalisation
  ff([...inputs.flatMap((f) => ["-i", f]), "-/filter_complex", graphFile, "-map", "[out]", "-c:a", "pcm_f32le", premix, "-map", "[env]", "-f", "f32le", envRaw, ...stemOut]);

  // two-pass loudness normalisation to -14 LUFS / -1.5 dBTP
  const LN = "loudnorm=I=-14:TP=-1.5:LRA=11";
  const m = JSON.parse(/\{[\s\S]*?\}/.exec(stderrOf(["-i", premix, "-af", `${LN}:print_format=json`, "-f", "null", "-"]).split("[Parsed_loudnorm")[1])[0]);
  // linear loudnorm cannot lower transients (claps, snaps): a -2.5 dBFS limiter trims them (loudness stays -14 LUFS).
  // AAC at 192k added up to +3 dB of true peak on a clap-heavy bed (measured 2026-09-27); 256k stays under -1 dBTP.
  const pass2 = `${LN}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,` +
    "alimiter=limit=0.75:attack=1:release=60:level=false";
  ff(["-i", premix, "-af", pass2, "-ar", "48000", "-c:a", "aac", "-b:a", "256k", join(root, "assets/audio/mix.m4a")]);
  console.log(`mix -> assets/audio/mix.m4a (premix ${m.input_i} LUFS -> -14)${stems ? `; stems in ${work}` : ""}`);

  // voice envelope at the video frame rate, normalised to its 90th percentile
  const buf = readFileSync(envRaw);
  const smp = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  return voiceEnvelope(smp, D, cfg.fps);
}
