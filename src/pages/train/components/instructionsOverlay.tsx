import { Button, Checkbox } from "antd";
import React from "react";

interface Props {
  exercise: ExerciseData;
  onClose: () => void;
}

const InstructionOverlay: React.FC<Props> = ({ exercise, onClose }) => {
  const exerciseName = exercise.title;
  const exerciseDescription = exercise.description;
  const exerciseVideo = exercise.videoPath;

  const videoEmbed = (
    video: string,
    style: React.CSSProperties
  ): JSX.Element => {
    // check for youtube
    const vidID = video.match(
      /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|clip\/|shorts\/|v=)([^#&?]*).*/
    );
    if (vidID && vidID[1]) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${vidID[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
          style={style}
        ></iframe>
      );
    }
    // try to embed the video as a video tag
    return <video src={video} controls style={style} />;
  };

  // Create a box that has the title on top centered,
  // description and video below next to each other
  // The video should be 16:9
  // On the top right there should be an x to close
  // The bottom should have an antd checkbox to not show again
  // Also on the bottom should be a real close button that says "close"
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      {/* X Button */}
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          padding: "10px",
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon="X"
          size="large"
          onClick={onClose}
          className="no-font-fix-button-weirdness"
          style={{
            backgroundColor: "white",
            color: "black",
            border: "none",
            boxShadow: "none",
            fontWeight: "bold",
          }}
        />
      </div>
      {/* TITLE */}
      <div>
        <h1
          style={{
            fontSize: "40px",
            fontFamily: "BigBoy",
          }}
        >
          {exerciseName}
        </h1>
      </div>
      {/* DESCRIPTION */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          maxHeight: "calc(100% - 120px)",
        }}
      >
        <div
          style={{
            margin: "auto",
            maxWidth: exerciseVideo ? "50%" : "100%",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          {exerciseDescription.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {exerciseVideo && (
          <div
            style={{
              width: "50%",
            }}
          >
            <div
              style={{
                position: "relative",
                height: 0,
                width: "80%",
                maxWidth: "80%",
                paddingBottom: "45%",
                overflow: "hidden",
                borderRadius: "10px",
                margin: "auto",
              }}
            >
              {videoEmbed(exerciseVideo, {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              })}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          height: "55px",
          display: "flex",
        }}
      >
        <Checkbox style={{ margin: "auto" }}>Don&#39;t show again</Checkbox>
        <Button
          type="primary"
          onClick={onClose}
          style={{
            margin: "10px",
            position: "absolute",
            right: "0",
            bottom: "0",
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default InstructionOverlay;
