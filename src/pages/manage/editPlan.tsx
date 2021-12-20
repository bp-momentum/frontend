import React, { useEffect } from "react";
import { Card, Col, InputNumber, Layout, Row, Space, Button, Modal, Input, message, Tooltip, Spin } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import Container from "../../shared/container";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { t } from "i18next";
import Translations from "../../localization/translations";
import { Header } from "antd/lib/layout/layout";
import api from "../../util/api";
import Routes from "../../util/routes";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { confirm } = Modal;

/**
 * All data a single exercise instance can have
 */
interface ExerciseData {
  type: number;
  sets: number;
  repeats: number;
}

// All data a single exercise card instance can have
interface ExerciseCardData {
  id: string;
  data: ExerciseData;
}

/**
 * Truncate a string with ellipsis if it is too long
 * @param str
 * @param num
 * @returns truncated string
 */
const truncate = (str: string, n : number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

/**
 * Maps a given exercise id to its corresponding name
 * @param id
 * @returns the name of the exercise
 */
const ExerciseIdToName = (id: number) => (
  truncate(exercises.filter(exercise => exercise.id === id).map(exercise => exercise.title)[0], 15) ?? <i>Unknown</i>
);

/**
 * The actual exercise card component
 * If details is set it will show the data of the exercise instance
 * If collapsed is set it will show a collapsed version of the card
 * @param {card: ExerciseData, details: boolean, collapsed: boolean} props
 * @returns a card with the given data
 */
const VisibleExercise = ({card, details, collapsed}: {card: ExerciseData, details: boolean, collapsed: boolean}) => {
  const [,redraw] = React.useState({});
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
    <Card title={
      <div style={{display: "flex", alignItems: "center"}}>
        <h1 style={{margin: "0"}}>{ExerciseIdToName(card.type)}</h1>
        {details && collapsed &&
          <Tooltip title={<><span>{t(Translations.planEditor.cardTooltipRepeats, {count: card.repeats}) + t(Translations.planEditor.cardTooltipSets, {count: card.sets})}</span></>}>
            <span style={{margin: "0", marginLeft: "auto", fontWeight: 400, fontSize: "14px"}}>{card.repeats} / {card.sets}</span>
          </Tooltip>
        }
      </div>
    } bordered bodyStyle={{padding: "0px", }}>
      {details && !collapsed &&
        <Space direction="vertical" style={{margin: "20px"}}>
          <InputNumber value={card.repeats} onChange={changeRepeats} addonAfter={<span># / Set</span>} min={1} max={100}/>
          <InputNumber value={card.sets} onChange={changeSets} addonAfter={<span>Sets</span>} min={1} max={100}/>
        </Space>
      }
    </Card>
  );
};

/**
 * Draggable wrapper for the VisibleExercise component
 * @param {item: ExerciseCardData, index: number, details: boolean} props
 * @returns draggable visible exercise card
 */
const Exercise = ({item, index, details}: {item: ExerciseCardData, index: number, details: boolean}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          onClick={() => {
            //
            setOpenState(item.id);
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            userSelect: "none",
            margin: "0 0 8px 0", }}
        >
          <VisibleExercise card={item.data} details={details} collapsed={openState !== item.id}/>
        </div>
      )}
    </Draggable>
  );
};

/**
 * A droppable context for the exercise cards that shows all exercises given
 * @param {list: ExerciseCardData[], name: string, displayName: string} props
 * @returns a droppable context for the exercise cards
 */
const Day = ({list, name, displayName}: {list: ExerciseCardData[], name: string, displayName: string}) => {
  return (
    <Col>
      <h1>
        {displayName}
      </h1>
      <Row style={{background: "#fff", display: "grid", borderRadius: "10px", marginBottom: "20px", minWidth: "200px"}}>
        <Droppable droppableId={name}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ gridRowStart: 1, gridColumnStart: 1, width: "200px", minHeight: "20px", padding: "10px", maxHeight: "400px", overflowY: "auto", overflowX: "hidden"}}
            >
              {list.map((item, index) => (
                <Exercise key={item.id} item={{...item}} index={index} details={true}/>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {list.length === 0 &&
          <div style={{
            gridRowStart: 1,
            gridColumnStart: 1,
            margin: "10px",
            width: "180px",
            padding: "20px",
            textAlign: "center",
            border: "2px dashed gray",
            borderRadius: "20px",
            userSelect: "none"}}>
            {t(Translations.planEditor.addExercise)}
          </div>
        }
      </Row>
    </Col>
  );
};

// The uncollapsed id of the exercise card
let openState: string;
// Change the uncollapsed id of the exercise card
let setOpenState: (id: string) => void;
// A list of all exercises
let exercises: {id: number, title: string}[];

/**
 * @returns the plan editor component
 */
const EditPlan = (): JSX.Element => {
  // the plans name
  const [name, setName] = React.useState("");
  // internal counter for unique ids
  const [count, setCount] = React.useState(0);
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
  [openState, setOpenState] = React.useState("");

  // the list of all available exercises
  let setExercises: (exercises: {id: number, title: string}[]) => void;
  [exercises, setExercises] = React.useState<{id: number, title: string}[]>([]);

  // reference to the garbage overlay component
  const GarbageSider = React.createRef<HTMLDivElement>();

  // planId from the url (either a numberlike string or "new")
  const { planId } = useParams();

  // WARN: Watch out React Router DOM v6 had breaking changes.
  const navigate = useNavigate();

  /**
   * Resolve a string in the form of either a weekday or "store" to the correct getter and setter of the state
   * @param drop
   * @returns {get: ExerciseCardData[], set: (data: ExerciseCardData[]) => void}
   */
  const DropToState = (drop: string): {get: ExerciseCardData[], set: (data: ExerciseCardData[]) => void} => {
    switch (drop) {
    case "monday":
      return {get: monday, set: setMonday};
    case "tuesday":
      return {get: tuesday, set: setTuesday};
    case "wednesday":
      return {get: wednesday, set: setWednesday};
    case "thursday":
      return {get: thursday, set: setThursday};
    case "friday":
      return {get: friday, set: setFriday};
    case "saturday":
      return {get: saturday, set: setSaturday};
    case "sunday":
      return {get: sunday, set: setSunday};
    case "store": default:
      return {get: storeItems, set: setStoreItems};
    }
  };

  /**
   * Reorders the two given lists based on the given indexes
   *
   * If source and destination are the same, the list is reordered
   *
   * If the source is the store, the item is duplicated from the store and added to the destination
   *
   * If the destination is the store, the item is removed from the source and destroyed
   *
   * If neither the source nor the destination is the store, the item is moved from the source to the destination
   *
   * It always returns the source list and the destination list after the reordering
   *
   * @param listLeave the list from which the item is moved
   * @param listJoin the list to which the item is moved
   * @param source the source location and index of the item
   * @param dest the destination location and index of the item
   * @returns {leave: ExerciseCardData[], join: ExerciseCardData[]}
   */
  const reorder = (
    listLeave: ExerciseCardData[],
    listJoin: ExerciseCardData[],
    source: DraggableLocation,
    dest: DraggableLocation): {leave: ExerciseCardData[], join: ExerciseCardData[]} => {

    const leaveArr = Array.from(listLeave);
    const joinArr = Array.from(listJoin);
    const fromStore = source.droppableId === "store";
    const toStore = dest.droppableId === "store";

    // easy if in same list (just reorder)
    if (source.droppableId === dest.droppableId) {
      const item = leaveArr.splice(source.index, 1)[0];
      leaveArr.splice(dest.index, 0, item);
      return {leave: leaveArr, join: leaveArr};
    }

    // remove from source when moving to store
    if (toStore) {
      leaveArr.splice(source.index, 1);
      return {leave: leaveArr, join: joinArr};
    }

    // duplicate item when leaving store
    if (fromStore) {
      setCount(count + 1);
      const data = leaveArr[source.index].data;
      const item = {id: `exercise-${count}`, data: {...data}};
      joinArr.splice(dest.index, 0, item);
      return {leave: leaveArr, join: joinArr};
    }

    // move from list to list (not store)
    const item = leaveArr.splice(source.index, 1)[0];
    joinArr.splice(dest.index, 0, item);
    return {leave: leaveArr, join: joinArr};
  };

  useEffect(() => {
    // load exercises from server
    if (!exercisesLoaded) {
      api.execute(Routes.getExercises()).then((response) => {
        if (!response.success) return;
        const storeItems = response.data.exercises.map((item: {id: number, title: string}) => (
          {id: `store-${item.id}`, data: {
            type: item.id,
            description: "string",
            sets: 1,
            repeats: 1,
          }}
        ));
        setStoreItems(storeItems);
        setExercises(response.data.exercises);
        setExercisesLoaded(true);
      });
    }

    if (!planLoaded && planId && planId !== "new") {
      api.execute(Routes.getTrainingPlan({planId: planId})).then(response => {
        if (!response.success) return;
        setName(response.data.name);
        for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
          const list1 = response.data.exercises.filter((item: {id: number, sets: number, repeats_per_set: number, date: string}) => item.date === day);
          const list2 = list1.map((item: {id: number, sets: number, repeats_per_set: number, date: string}, index: number) => (
            {id: `restored-${day}-${index}`,
              data: {
                type: item.id,
                sets: item.sets,
                repeats: item.repeats_per_set}
            }));
          DropToState(day).set(list2);
        }
        setPlanLoaded(true);
      });
    }

    if (planId === "new") {
      setPlanLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  /**
   * Initiate reordering after dropping an item
   * @param result
   * @returns
   */
  const onDragEnd = (result: DropResult) => {
    // hide garbage sider
    if (GarbageSider?.current)
      GarbageSider.current.style.display = "none";

    // no destination == no reordering
    if (!result.destination) {
      return;
    }

    // reorder the lists
    const {join, leave} = reorder(
      DropToState(result.source.droppableId).get,
      DropToState(result.destination.droppableId).get,
      result.source,
      result.destination
    );
    // update the lists
    DropToState(result.source.droppableId).set(leave);
    DropToState(result.destination.droppableId).set(join);
  };

  /**
   * Save the plan to the server
   */
  const save = () => {
    // Data is the object that is sent to the server
    // Needs to be any for dynamic typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    // If the plan is new, the id is not set
    if (planId !== "new") data.id = planId;
    data.name = name;
    data.exercise = [];
    for (const date of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
      const list = DropToState(date).get;
      const items = list.map((item: ExerciseCardData) => ({
        date: date,
        id: item.data.type,
        sets: item.data.sets,
        repeats_per_set: item.data.repeats
      }));
      data.exercise = data.exercise.concat(items);
    }

    api.execute(Routes.saveTrainingPlan(data)).then(response => {
      if (!response.success) {
        message.error(t(Translations.planEditor.saveError));
        return;
      }
      if (response.data.plan_id !== planId) {
        navigate(`../plans/${response.data.plan_id}`, {replace: true});
      }
      message.success(t(Translations.planEditor.saveSuccess));
    });
  };

  /**
   * Wrapper for the save function
   * Shows a modal for naming if the plan has no name before saving
   */
  const savePlan = () => {
    if (!name) {
      setSaveModalVisible(true);
    }
    else {
      save();
    }
  };

  /**
   * Delete the plan from the server
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
          api.execute(Routes.deleteTrainingPlan({planId: planId})).then(response => {
            if (!response.success) {
              message.error(t(Translations.planEditor.deleteError));
            }
            else {
              message.success(t(Translations.planEditor.deleteSuccess));
              navigate("../plans", {replace: true});
            }
          });
        }
        // if the plan is new, the component will be unmounted and the user will be redirected to the plans page
        else {
          message.success(t(Translations.planEditor.deleteSuccess));
          navigate("../plans", {replace: true});
        }
      },
    });
  };

  return (
    <Container
      currentPage="manage"
      color="blue"
    >
      <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)} onDragStart={()=> {
          if (GarbageSider.current)
            GarbageSider.current.style.display = "block";
        }}>
          <Sider
            style={{background: "#e0e0e0", padding: "0", paddingTop: "20px"}} width="220px">
            {!exercisesLoaded ? (
              <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                <div>{t(Translations.planManager.loading)}</div>
              </div>
            ) :(
              <div
                style={{height: "100%", display: "flex", flexDirection: "column"}}>
                <h1 style={{padding: "0 10px"}}>{t(Translations.planEditor.exercises)}</h1>
                <div style={{overflow: "auto", padding: "0 10px", flexGrow: 1, display: "flex"}} >
                  <Droppable droppableId="store">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{flexGrow: 1}}
                      >
                        {storeItems.map((item, index) => (
                          <Exercise key={item.id} item={{...item}} index={index} details={false} />
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
            ref={GarbageSider}
            style={{background: "#e0e0e0", padding: "20px 0", position: "absolute", height: "100%", display: "none"}} width="220px">
            <div
              style={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
              <div style={{
                width: "180px",
                padding: "20px",
                textAlign: "center",
                border: "2px dashed gray",
                borderRadius: "20px",
                userSelect: "none"}}>
                <DeleteOutlined style={{fontSize: 50}} />
                <br />
                {t(Translations.planEditor.deleteExercise)}
              </div>
            </div>
          </Sider>
          <Content style={{display: "flex", width: "100%"}}>
            {!planLoaded ? (
              <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                <div>{t(Translations.planManager.loading)}</div>
              </div>
            ) : (
              <Layout>
                <Header style={{backgroundColor: "#fff", display: "flex", padding: "0px 20px", alignItems: "center"}}>
                  <Input
                    placeholder={t(Translations.planEditor.unnamed)}
                    value={name}
                    bordered={false}
                    onChange={change => {
                      setName(change.target.value);
                    }} />
                  <Space style={{marginLeft: "auto"}} >
                    <Button type="primary" onClick={savePlan}>{t(Translations.confirm.save)}</Button>
                    <Modal
                      visible={saveModalVisible}
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
                      <Input placeholder={t(Translations.planEditor.unnamed)} value={name} onChange={(change) => {
                        setName(change.target.value);
                      }}/>
                    </Modal>
                    <Button danger onClick={deletePlan}>{t(Translations.confirm.delete)}</Button>
                  </Space>
                </Header>
                <Content style={{display: "flex", width: "100%", padding: "10px", paddingTop: "20px", overflow: "auto"}}>
                  <Row
                    style={{width: "100%", alignContent: "flex-start"}}
                    justify="center"
                    gutter={16}
                  >
                    <Day list={monday} name="monday" displayName={t(Translations.weekdays.monday)}></Day>
                    <Day list={tuesday} name="tuesday" displayName={t(Translations.weekdays.tuesday)}></Day>
                    <Day list={wednesday} name="wednesday" displayName={t(Translations.weekdays.wednesday)}></Day>
                    <Day list={thursday} name="thursday" displayName={t(Translations.weekdays.thursday)}></Day>
                    <Day list={friday} name="friday" displayName={t(Translations.weekdays.friday)}></Day>
                    <Day list={saturday} name="saturday" displayName={t(Translations.weekdays.saturday)}></Day>
                    <Day list={sunday} name="sunday" displayName={t(Translations.weekdays.sunday)}></Day>
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
