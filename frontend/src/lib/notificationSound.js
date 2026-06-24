let audioContext;

export const playMessageSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const firstTone = audioContext.createOscillator();
    const secondTone = audioContext.createOscillator();

    firstTone.type = "sine";
    secondTone.type = "sine";
    firstTone.frequency.setValueAtTime(620, now);
    secondTone.frequency.setValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    firstTone.connect(gain);
    secondTone.connect(gain);
    gain.connect(audioContext.destination);

    firstTone.start(now);
    firstTone.stop(now + 0.16);
    secondTone.start(now + 0.08);
    secondTone.stop(now + 0.28);
  } catch (error) {
    console.debug("Notification sound was blocked by the browser", error);
  }
};
