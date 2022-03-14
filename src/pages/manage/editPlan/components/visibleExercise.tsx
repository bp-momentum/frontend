import React from "react";
import { Card, InputNumber, Space, Tooltip } from "antd";
import { t } from "i18next";
import Translations from "@localization/translations";
import { exerciseIdToName } from "../functions";
import { useAppDispatch } from "@redux/hooks";
import { setPlanChanges } from "@redux/changes/changeSlice";

interface Props {
  card: BasicExerciseData;
  details: boolean;
  collapsed: boolean;
  exercises: Exercise[];
}

/**
 * The actual exercise card component
 * If details is set it will show the data of the exercise instance
 * If collapsed is set it will show a collapsed version of the card
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const VisibleExercise: React.FC<Props> = ({
  card,
  details,
  collapsed,
  exercises,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  const [, redraw] = React.useState({});
  /**
   * Change the number of sets of this exercise instance and redraw the card
   * @param {number} value new number of sets
   * @returns {void}
   */
  const changeSets = (value: number) => {
    card.sets = value;
    dispatch(setPlanChanges(true));
    redraw({});
  };
  /**
   * Change the number of repeats per set of this exercise instance and redraw the card
   * @param {number} value new number of repeats per set
   * @returns {void}
   */
  const changeRepeats = (value: number) => {
    card.repeats = value;
    dispatch(setPlanChanges(true));
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
