import React from "react";
import { Card, InputNumber, Space, Tooltip } from "antd";
import { t } from "i18next";
import Translations from "../../../../localization/translations";
import { exerciseIdToName } from "../functions";

interface visibleExerciseProps {
  card: ExerciseData2;
  details: boolean;
  collapsed: boolean;
  exercises: Exercise[];
}

/**
 * The actual exercise card component
 * If details is set it will show the data of the exercise instance
 * If collapsed is set it will show a collapsed version of the card
 * @param {card: ExerciseData, details: boolean, collapsed: boolean} props
 * @returns a card with the given data
 */
const VisibleExercise: React.FC<visibleExerciseProps> = ({ ...props }) => {
  const { card, details, collapsed, exercises } = props;

  const [, redraw] = React.useState({});
  /**
   * Change the number of sets of this exercise instance and redraw the card
   * @param value new number of sets
   */
  const changeSets = (value: number) => {
    card.sets = value;
    redraw({});
  };
  /**
   * Change the number of repeats per set of this exercise instance and redraw the card
   * @param value new number of repeats per set
   */
  const changeRepeats = (value: number) => {
    card.repeats = value;
    redraw({});
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ margin: "0" }}>
            {exerciseIdToName(exercises, card.type)}
          </h1>
          {details && collapsed && (
            <Tooltip
              title={
                <>
                  <span>
                    {t(Translations.planEditor.cardTooltipRepeats, {
                      count: card.repeats,
                    }) +
                      t(Translations.planEditor.cardTooltipSets, {
                        count: card.sets,
                      })}
                  </span>
                </>
              }
            >
              <span
                style={{
                  margin: "0",
                  marginLeft: "auto",
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                {card.repeats} / {card.sets}
              </span>
            </Tooltip>
          )}
        </div>
      }
      bordered
      bodyStyle={{ padding: "0px" }}
    >
      {details && !collapsed && (
        <Space direction="vertical" style={{ margin: "20px" }}>
          <InputNumber
            value={card.repeats}
            onChange={changeRepeats}
            addonAfter={<span># / Set</span>}
            min={1}
            max={100}
          />
          <InputNumber
            value={card.sets}
            onChange={changeSets}
            addonAfter={<span>Sets</span>}
            min={1}
            max={100}
          />
        </Space>
      )}
    </Card>
  );
};

export default VisibleExercise;
