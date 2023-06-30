import { useState } from "react";

const useWebcam = () => {
  const [webcam, setWebcam] = useState<MediaStream | false | null>(null);

  function getWebcam() {
    if (!navigator.mediaDevices.getUserMedia) {
      console.error("No webcam support.");
      return null;
    }

    console.log("Getting webcam...");

    setWebcam(false);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setWebcam(stream);
        return stream;
      })
      .catch((error) => {
        setWebcam(null);
        return null;
      });
  }

  if (webcam === null) {
    getWebcam();
  }

  return webcam;
};

export default useWebcam;
