import React, { useEffect } from "react";
import { Layout, Row, Space, Button, Modal, Input, message, Spin } from "antd";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Container from "@shared/container";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Translations from "@localization/translations";
import { Header } from "antd/lib/layout/layout";
import Routes from "@util/routes";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import Exercise from "./components/exercise";
import Day from "./components/day";
import { reorder } from "./functions";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setPlanChanges } from "@redux/changes/changeSlice";
import useApi from "@hooks/api";

const { Sider, Content } = Layout;
const { confirm } = Modal;

/**
 * the plan editor component
 * @returns {JSX.Element} The page
 */
const EditPlan: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  // the plans name
  const [name, setName] = React.useState("");
  // internal counter for unique ids
  const count = React.useRef(0);
  // lists of exercise instances for each day
  const [storeItems, setStoreItems] = React.useState<ExerciseCardData[]>([]);
  const [monday, setMonday] = React.useState<ExerciseCardData[]>([]);
  const [tuesday, setTuesday] = React.useState<ExerciseCardData[]>([]);
  const [wednesday, setWednesday] = React.useState<ExerciseCardData[]>([]);
  const [thursday, setThursday] = React.useState<ExerciseCardData[]>([]);
  const [friday, setFriday] = React.useState<ExerciseCardData[]>([]);
  const [saturday, setSaturday] = React.useState<ExerciseCardData[]>([]);
  const [sunday, setSunday] = React.useState<ExerciseCardData[]>([]);
  // whether the save modal is visible
  const [saveModalVisible, setSaveModalVisible] = React.useState(false);
  // whether the plan content was loaded from the api
  const [planLoaded, setPlanLoaded] = React.useState(false);
  // whether the list of exercises was loaded from the api
  const [exercisesLoaded, setExercisesLoaded] = React.useState(false);

  // initialize the uncollapsed id of the exercise card
  const [openState, setOpenState] = React.useState("");

  // the list of all available exercises
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  // reference to the garbage overlay component
  const GarbageSider = React.createRef<HTMLDivElement>();

  // planId from the url (either a numberlike string or "new")
  const { planId } = useParams();

  // WARN: Watch out React Router DOM v6 had breaking changes.
  const navigate = useNavigate();

  const hasChanged = useAppSelector((state) => state.changes.planChanges);
  const dispatch = useAppDispatch();

  const api = useApi();

  useEffect(() => {
    dispatch(setPlanChanges(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Resolve a string in the form of either a weekday or "store" to the correct getter and setter of the state
   * @param {string} drop The day to resolve
   * @returns {{get: ExerciseCardData[], set: function(data: ExerciseCardData[]): void}} The getter and setter
   */
  const DropToState = (
    drop: string
  ): { get: ExerciseCardData[]; set: (data: ExerciseCardData[]) => void } => {
    switch (drop) {
      case "monday":
        return { get: monday, set: setMonday };
      case "tuesday":
        return { get: tuesday, set: setTuesday };
      case "wednesday":
        return { get: wednesday, set: setWednesday };
      case "thursday":
        return { get: thursday, set: setThursday };
      case "friday":
        return { get: friday, set: setFriday };
      case "saturday":
        return { get: saturday, set: setSaturday };
      case "sunday":
        return { get: sunday, set: setSunday };
      case "store":
      default:
        return { get: storeItems, set: setStoreItems };
    }
  };

  /**
   * convert API data to useable data
   * @returns {Promise} The data
   */
  const prepareExercises = async (): Promise<{
    storeItems: ExerciseCardData[];
    exercises: Exercise[];
  }> => {
    const response = await api.execute(Routes.getExercises());
    if (!response) throw new Error("Failed to load exercises");
    if (!response.success) throw new Error(response.description);
    const storeItems = response.data.exercises.map(
      (item: { id: number; title: string }) => ({
        id: `store-${item.id}`,
        data: {
          type: item.id,
          description: "string",
          sets: 1,
          repeats: 1,
        },
      })
    );
    return { storeItems, exercises: response.data.exercises };
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    let isMounted = true;
    // load exercises from server
    prepareExercises()
      .then(({ storeItems, exercises }) => {
        if (!isMounted) return;
        setStoreItems(storeItems);
        setExercises(exercises);
        setExercisesLoaded(true);
      })
      .catch((error) => {
        message.error(error.message);
      });

    // load plan from server
    if (planId && planId !== "new") {
      api
        .execute(Routes.getTrainingPlan({ planId: planId }))
        .then((response) => {
          if (!isMounted) return;
          if (!response.success) {
            message.error(response.description);
            return;
          }
          setName(response.data.name);
          for (const day of days) {
            let list1: ExerciseInPlan[] = response.data.exercises;
            list1 = list1.filter((item) => item.date === day);
            const list2: ExerciseCardData[] = _.map(
              list1,
              // eslint-disable-next-line no-loop-func
              (item, index: number) => ({
                id: `restored-${day}-${index}`,
                data: {
                  type: item.id,
                  sets: item.sets,
                  repeats: item.repeats_per_set,
                },
              })
            );
            DropToState(day).set(list2);
          }
          setPlanLoaded(true);
        });
    } else if (planId === "new") {
      setPlanLoaded(true);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initiate reordering after dropping an item
   * @param {DropResult} result The result of the drop
   * @returns {void}
   */
  const onDragEnd = (result: DropResult): void => {
    // hide garbage sider
    if (GarbageSider?.current) GarbageSider.current.style.display = "none";

    // no destination == no reordering
    if (!result.destination) {
      return;
    }

    // source and destination are the same
    // thus no reordering
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    )
      return;

    // disallow store reordering
    if (
      result.source.droppableId === "store" &&
      result.destination.droppableId === "store"
    )
      return;

    if (!hasChanged) dispatch(setPlanChanges(true));

    // reorder the lists
    const { join, leave } = reorder(
      DropToState(result.source.droppableId).get,
      DropToState(result.destination.droppableId).get,
      result.source,
      result.destination,
      count
    );
    // update the lists
    DropToState(result.source.droppableId).set(leave);
    DropToState(result.destination.droppableId).set(join);
  };

  /**
   * Save the plan to the server
   * @returns {void}
   */
  const save = (): void => {
    // Data is the object that is sent to the server
    // Needs to be any for dynamic typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    // If the plan is new, the id is not set
    if (planId !== "new") data.id = planId;
    data.name = name;
    data.exercise = [];
    for (const date of days) {
      const list = DropToState(date).get;
      const items = list.map((item) => ({
        date: date,
        id: item.data.type,
        sets: item.data.sets,
        repeats_per_set: item.data.repeats,
      }));
      data.exercise = data.exercise.concat(items);
    }

    api.execute(Routes.saveTrainingPlan(data)).then((response) => {
      if (!response.success) {
        message.error(
          response.description ?? t(Translations.planEditor.saveError)
        );
        return;
      }
      if (response.data.plan_id !== planId) {
        navigate(`../plans/${response.data.plan_id}`, { replace: true });
      }
      message.success(t(Translations.planEditor.saveSuccess));
      dispatch(setPlanChanges(false));
    });
  };

  /**
   * Wrapper for the save function
   * Shows a modal for naming if the plan has no name before saving
   * @returns {void}
   */
  const savePlan = () => {
    if (!name) {
      setSaveModalVisible(true);
    } else {
      save();
    }
  };

  /**
   * Delete the plan from the server
   * @returns {void}
   */
  const deletePlan = () => {
    confirm({
      title: t(Translations.planEditor.deletePlanConfirm),
      content: t(Translations.planEditor.deletePlanDescription),
      okText: t(Translations.confirm.yes),
      okType: "danger",
      cancelText: t(Translations.confirm.no),
      onOk() {
        // if the plan is not new it needs to be deleted from the server
        if (planId && planId !== "new") {
          api
            .execute(Routes.deleteTrainingPlan({ planId: planId }))
            .then((response) => {
              if (!response.success) {
                message.error(t(Translations.planEditor.deleteError));
              } else {
                message.success(t(Translations.planEditor.deleteSuccess));
                navigate("../plans", { replace: true });
              }
            });
        }
        // if the plan is new, the component will be unmounted and the user will be redirected to the plans page
        else {
          message.success(t(Translations.planEditor.deleteSuccess));
          navigate("../plans", { replace: true });
        }
      },
    });
  };

  return (
    <Container
      currentPage="manage"
      confirmLeaveMessage={
        hasChanged
          ? (t(Translations.common.confirmLeaveChanges) as string)
          : false
      }
    >
      <Layout
        style={{
          height: "100%",
          position: "absolute",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result)}
          onDragStart={() => {
            if (GarbageSider.current)
              GarbageSider.current.style.display = "block";
          }}
        >
          <Sider
            style={{ background: "#e0e0e0", padding: "0", paddingTop: "20px" }}
            width="220px"
          >
            {!exercisesLoaded ? (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                <div>{t(Translations.planManager.loading)}</div>
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1 style={{ padding: "0 10px" }}>
                  {t(Translations.planEditor.exercises)}
                </h1>
                <div
                  style={{
                    overflow: "auto",
                    padding: "0 10px",
                    flexGrow: 1,
                    display: "flex",
                  }}
                >
                  <Droppable droppableId="store">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ flexGrow: 1 }}
                      >
                        {storeItems.map((item, index) => (
                          <Exercise
                            key={item.id}
                            item={{ ...item }}
                            index={index}
                            details
                            exercises={exercises}
                            openState={openState}
                            setOpenState={setOpenState}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            )}
          </Sider>
          <Sider
            data-testid="garbage"
            ref={GarbageSider}
            style={{
              background: "#e0e0e0",
              padding: "20px 0",
              position: "absolute",
              height: "100%",
              display: "none",
            }}
            width="220px"
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "180px",
                  padding: "20px",
                  textAlign: "center",
                  border: "2px dashed gray",
                  borderRadius: "20px",
                  userSelect: "none",
                }}
              >
                <DeleteOutlined style={{ fontSize: 50 }} />
                <br />
                {t(Translations.planEditor.deleteExercise)}
              </div>
            </div>
          </Sider>
          <Content style={{ display: "flex", width: "100%" }}>
            {!planLoaded ? (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                <div>{t(Translations.planManager.loading)}</div>
              </div>
            ) : (
              <Layout>
                <Header
                  style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    padding: "0px 20px",
                    alignItems: "center",
                  }}
                >
                  <Input
                    placeholder={t(Translations.planEditor.unnamed)}
                    value={name}
                    bordered={false}
                    onChange={(change) => {
                      setName(change.target.value);
                    }}
                  />
                  <Space style={{ marginLeft: "auto" }}>
                    <Button type="primary" onClick={savePlan}>
                      {t(Translations.confirm.save)}
                    </Button>
                    <Modal
                      open={saveModalVisible}
                      title={t(Translations.planEditor.savePlanMissingName)}
                      okText={t(Translations.confirm.save)}
                      okType="primary"
                      okButtonProps={{
                        disabled: name === "",
                      }}
                      cancelText={t(Translations.confirm.cancel)}
                      onOk={() => {
                        setSaveModalVisible(false);
                        savePlan();
                      }}
                      onCancel={() => {
                        setSaveModalVisible(false);
                      }}
                    >
                      <Input
                        placeholder={t(Translations.planEditor.unnamed)}
                        value={name}
                        onChange={(change) => {
                          setName(change.target.value);
                        }}
                      />
                    </Modal>
                    <Button danger onClick={deletePlan}>
                      {t(Translations.confirm.delete)}
                    </Button>
                  </Space>
                </Header>
                <Content
                  style={{
                    display: "flex",
                    width: "100%",
                    padding: "10px",
                    paddingTop: "20px",
                    overflow: "auto",
                  }}
                >
                  <Row
                    style={{ width: "100%", alignContent: "flex-start" }}
                    justify="center"
                    gutter={16}
                  >
                    <Day
                      list={monday}
                      name="monday"
                      displayName={t(Translations.weekdays.monday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={tuesday}
                      name="tuesday"
                      displayName={t(Translations.weekdays.tuesday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={wednesday}
                      name="wednesday"
                      displayName={t(Translations.weekdays.wednesday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={thursday}
                      name="thursday"
                      displayName={t(Translations.weekdays.thursday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={friday}
                      name="friday"
                      displayName={t(Translations.weekdays.friday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={saturday}
                      name="saturday"
                      displayName={t(Translations.weekdays.saturday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                    <Day
                      list={sunday}
                      name="sunday"
                      displayName={t(Translations.weekdays.sunday)}
                      exercises={exercises}
                      openState={openState}
                      setOpenState={setOpenState}
                    ></Day>
                  </Row>
                </Content>
              </Layout>
            )}
          </Content>
        </DragDropContext>
      </Layout>
    </Container>
  );
};

export default EditPlan;
