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
  // File extension of the audio files
  #audioFileExtension = ".wav";
  // specif URL for a given audio file in a given category
  audioUrlFormatter = (id: number, category: string) =>
    `${this.cdnUrl}sounds/${category}/${id}${this.#audioFileExtension}`;
  // all available audio files by category
  soundsPerCategory = {
    good: _.range(16),
    better: [""],
    best: [""],
  };
}

export default new config();
