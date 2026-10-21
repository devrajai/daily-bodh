#!/usr/bin/env python3
"""Generate the original temple-sound tones bundled with Daily Bodh.

Everything here is synthesised from scratch, so there is no recording and no
copyright attached. Output: OGG Vorbis files in app/src/main/assets/sounds/.

    python3 tools/make_sounds.py --out app/src/main/assets/sounds
"""
import argparse, os, subprocess, tempfile, wave

import numpy as np

try:
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:  # pragma: no cover
    FFMPEG = None

SR = 44100


def _env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0.0, 1.0)
    return a * np.exp(-t * decay)


def bell(dur=3.4, f0=520.0, decay=1.15):
    """Temple bell: inharmonic partials with a long tail."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    partials = [(1.0, 1.0), (2.0, 0.62), (2.76, 0.45), (4.07, 0.30),
                (5.43, 0.22), (6.80, 0.15), (8.20, 0.10)]
    x = np.zeros(n)
    for r, amp in partials:
        x += amp * np.sin(2 * np.pi * f0 * r * t + 0.31 * r)
    return x * _env(n, 0.002, decay)


def gong(dur=5.0, f0=148.0, decay=0.5):
    """Low gong with slow beating between close partials."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for r, amp in [(1.0, 1.0), (1.5, 0.5), (2.03, 0.4), (2.98, 0.3),
                   (4.10, 0.2), (5.20, 0.14), (6.70, 0.1)]:
        x += amp * np.sin(2 * np.pi * f0 * r * t + 0.7 * r)
    x *= 1.0 + 0.25 * np.sin(2 * np.pi * 1.7 * t)
    return x * _env(n, 0.01, decay)


def conch(dur=3.2, f0=233.0):
    """Conch (shankh): sustained, breathy, slightly unstable pitch."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    vib = 1.0 + 0.012 * np.sin(2 * np.pi * 5.2 * t)
    x = np.zeros(n)
    for r, amp in [(1.0, 1.0), (2.0, 0.55), (3.0, 0.35), (4.0, 0.22),
                   (5.0, 0.14), (6.0, 0.09)]:
        x += amp * np.sin(2 * np.pi * f0 * r * t * vib)
    rng = np.random.default_rng(7)
    x += 0.05 * rng.normal(size=n) * np.exp(-t * 1.5)
    attack = np.clip(t / 0.18, 0.0, 1.0)
    release = np.clip((dur - t) / 0.5, 0.0, 1.0)
    return x * attack * release


def ghanti(dur=2.6, f0=1180.0):
    """Small hand bell used during aarti: bright, with a double strike."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for r, amp in [(1.0, 1.0), (2.4, 0.5), (3.9, 0.3), (5.6, 0.2)]:
        x += amp * np.sin(2 * np.pi * f0 * r * t)
    x *= _env(n, 0.001, 2.2)
    offset = int(SR * 0.42)
    if offset < n:
        x[offset:] += 0.7 * bell(dur - offset / SR, f0, 2.2)[: n - offset]
    return x


TONES = {
    "temple_bell": bell,
    "gong": gong,
    "conch": conch,
    "aarti_bell": ghanti,
}


def encode(wav_path, ogg_path):
    for codec in ("libvorbis", "libopus", "libmp3lame"):
        cmd = [FFMPEG, "-y", "-loglevel", "error", "-i", wav_path,
               "-ac", "1", "-c:a", codec, ogg_path]
        try:
            subprocess.run(cmd, check=True)
            return codec
        except Exception:
            continue
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        for name, fn in TONES.items():
            x = fn()
            peak = float(np.max(np.abs(x))) or 1.0
            x = (x / peak) * 0.89
            pcm = (x * 32767).astype("<i2")

            wav_path = os.path.join(tmp, name + ".wav")
            with wave.open(wav_path, "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(SR)
                w.writeframes(pcm.tobytes())

            out_path = os.path.join(args.out, f"{name}.ogg")
            codec = encode(wav_path, out_path) if FFMPEG else None
            if codec is None:
                out_path = os.path.join(args.out, f"{name}.wav")
                os.replace(wav_path, out_path)
                codec = "pcm(wav)"
            print(f"{os.path.basename(out_path):20s} {os.path.getsize(out_path)/1024:7.1f} KB  {codec}")


if __name__ == "__main__":
    main()
