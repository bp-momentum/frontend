const soundsPerCategory: Record<audioCategory, string[]> = {
  good: ["good.opus", "keep_it_up.opus", "way_to_go.opus"],
  better: [
    "NICE.opus",
    "RIGHT_ON.opus",
    "there_you_go.opus",
    "WOUW.opus",
    "WOW.opus",
    "YEAH.opus",
  ],
  best: [
    "AMAZING.opus",
    "EXCELLENT.opus",
    "INCREDIBLE.opus",
    "LOOKS_GREAT.opus",
    "THERE_IT_IS.opus",
  ],
  perfect: ["GREAT_AIR.opus", "NICE_JUMP.opus"],
};

export const playRandomSound = (category: audioCategory) => {
  const audioFiles = soundsPerCategory[category];

  const file = Math.floor(Math.random() * audioFiles.length);
  const fileId = audioFiles[file];

  const url = process.env.PUBLIC_URL + "/audio/" + fileId;

  const audio = new Audio(url);
  audio.volume = 0.2;
  audio.play();
};

export const playBeep = (final: boolean) => {
  const url =
    process.env.PUBLIC_URL + "/audio/" + (final ? "beep2.wav" : "beep.wav");

  const audio = new Audio(url);
  audio.volume = 0.2;
  audio.play();
};
