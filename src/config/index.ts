import _ from "lodash";

// ========================================================
//                          CONFIG
// ========================================================
class config {
  // ====================================================
  //                     all domains
  // ====================================================
  // URL of the backend server
  backendUrl = "https://bp-api.geoscribble.de/";
  // URL of the backend websocket server
  websocketUrl = "wss://bp-api.geoscribble.de/";
  // URL of the cdn server
  cdnUrl = "https://cdn.geoscribble.de/";
  // URL of the frontend server (including root path)
  frontendUrl = "https://bp.geoscribble.de/#/";

  // ====================================================
  //                       Avatars
  // ====================================================
  // File extension of the avatar files
  #avatarFileExtension = ".png";
  // all available avatars by ID
  avatarRange = _.range(1, 51);
  // specif URL for a given avatar
  avatarUrlFormatter = (id: number) =>
    `${this.cdnUrl}/avatars/avatar_${id}${this.#avatarFileExtension}`;

  // ====================================================
  //                  Auditive Feedback
  // ====================================================
  // specif URL for a given audio file in a given category
  audioUrlFormatter = (id: string, category: string) =>
    `${this.cdnUrl}sounds/${category}/${id}`;
  // all available audio files by category
  soundsPerCategory: Record<audioCategory, string[]> = {
    good: ["good.wav", "keep_it_up.wav", "way_to_go.wav"],
    better: [
      "NICE.wav",
      "RIGHT_ON.wav",
      "there_you_go.wav",
      "WOUW.wav",
      "WOW.wav",
      "YEAH.wav",
    ],
    best: [
      "AMAZING.wav",
      "EXCELLENT.wav",
      "INCREDIBLE.wav",
      "LOOKS_GREAT.wav",
      "THERE_IT_IS.wav",
    ],
    perfect: ["GREAT_AIR.wav", "NICE_JUMP.wav"],
  };
  // all audio category thresholds
  // This is the upper bound for the audio category.
  // If the audio score is lower than a categories value, an audio file from this category is played.
  audioThresholds: Record<audioCategory, number> = {
    good: 0.5,
    better: 0.7,
    best: 0.9,
    perfect: 1,
  };
}

export default new config();
