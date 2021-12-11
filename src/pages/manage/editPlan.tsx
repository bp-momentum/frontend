import React, { createRef } from "react";
import { Card, Col, InputNumber, Layout, Row, Space, Button, Modal, Input, message, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import Container from "../../shared/container";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { t } from "i18next";
import Translations from "../../localization/translations";
import { Header } from "antd/lib/layout/layout";

const { Sider, Content } = Layout;
const { confirm } = Modal;

// get from API later
enum ExerciseType {
  Squat = "Squat",
  Pushup = "Pushup",
  Bench = "Bench",
  Deadlift = "Deadlift",
  Row = "Row",
  Pullup = "Pullup",
  Situp = "Situp",
}

interface ExerciseData {
  type: ExerciseType;
  description?: string;
  sets: number;
  repeats: number;
}

interface ExerciseCardData {
  id: string;
  data: ExerciseData;
}

// reorder all lists after drag and drop
const reorder = (
  listLeave: ExerciseCardData[],
  listJoin: ExerciseCardData[],
  source: DraggableLocation,
  dest: DraggableLocation,
  count: number, 
  setCount: React.Dispatch<React.SetStateAction<number>>) => {

  const leaveArr = Array.from(listLeave);
  const joinArr = Array.from(listJoin);
  const fromStore = source.droppableId === "store";
  const toStore = dest.droppableId === "store";

  // easy if in same list
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

const VisibleExercise = ({card, details, collapsed}: {card: ExerciseData, details: boolean, collapsed: boolean}) => {
  const changeSets = (value: number) => {
    card.sets = value;
    redraw({});
  };
  const changeRepeats = (value: number) => {
    card.repeats = value;
    redraw({});
  };

  return (
    <Card title={
      <div style={{display: "flex", alignItems: "center"}}>
        <h1 style={{margin: "0"}}>{card.type}</h1>
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

let redraw: React.Dispatch<React.SetStateAction<Record<string, never>>>;
let openState: string;
let setOpenState: React.Dispatch<React.SetStateAction<string>>;

const EditPlan = () : JSX.Element => {
  const [name, setName] = React.useState("");
  const [count, setCount] = React.useState(0);
  [, redraw] = React.useState({});
  [openState, setOpenState] = React.useState("");

  const [storeItems, setStoreItems] = React.useState<ExerciseCardData[]>(
    Object.values(ExerciseType).map(e => {
      return {
        id: e,
        data: {
          type: e,
          description: "string",
          sets: 1,
          repeats: 1,
        }};
    }));
  const [monday, setMonday] = React.useState<ExerciseCardData[]>([]);
  const [tuesday, setTuesday] = React.useState<ExerciseCardData[]>([]);
  const [wednesday, setWednesday] = React.useState<ExerciseCardData[]>([]);
  const [thursday, setThursday] = React.useState<ExerciseCardData[]>([]);
  const [friday, setFriday] = React.useState<ExerciseCardData[]>([]);
  const [saturday, setSaturday] = React.useState<ExerciseCardData[]>([]);
  const [sunday, setSunday] = React.useState<ExerciseCardData[]>([]);

  const [saveModalVisible, setSaveModalVisible] = React.useState(false);

  function DropToState(drop: string) {
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
    case "garbage":
      return {get: sunday, set: setSunday};
    case "store": default:
      return {get: storeItems, set: setStoreItems};
    }
  }

  const StoreSider = createRef<HTMLDivElement>();
  const GarbageSider = createRef<HTMLDivElement>();

  const onDragEnd = (result: DropResult) => {
    if (GarbageSider.current)
      GarbageSider.current.style.display = "none";

    if (!result.destination) {
      return;
    }

    const {join, leave} = reorder(
      DropToState(result.source.droppableId).get,
      DropToState(result.destination.droppableId).get,
      result.source,
      result.destination,
      count,
      setCount
    );
    DropToState(result.source.droppableId).set(leave);
    DropToState(result.destination.droppableId).set(join);
  };

  const save = () => {
    // TODO save plan
    message.success(t(Translations.planEditor.saveSuccess));
  };

  const savePlan = () => {
    if (!name) {
      setSaveModalVisible(true);
    }
    else {
      save();
    }
  };

  const deletePlan = () => {
    confirm({
      title: t(Translations.planEditor.deletePlanConfirm),
      content: t(Translations.planEditor.deletePlanDescription),
      okText: t(Translations.confirm.yes),
      okType: "danger",
      cancelText: t(Translations.confirm.no),
      onOk() {
        // TODO delete plan
        // If on server, send request to delete plan
        // If deleted successfully, redirect to home
        // If not on server, just redirect to home
      },
    });
  };

  return (
    <Container
      currentPage="manage"
      color="blue"
    >
      <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={()=> {
          if (GarbageSider.current)
            GarbageSider.current.style.display = "block";
        }}>
          <Sider 
            ref={StoreSider}
            style={{background: "#e0e0e0", padding: "0", paddingTop: "20px"}} width="220px">
            <div
              style={{height: "100%", display: "flex", flexDirection: "column"}}>
              <h1 style={{padding: "0 10px"}}>{t(Translations.planEditor.exercises)}</h1>
              <div style={{overflow: "auto", padding: "0 10px", flexGrow: 1}} >
                <Droppable droppableId="store">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{}}
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
                    <Input placeholder="Name" value={name} onChange={(change) => {
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
          </Content>
        </DragDropContext>
      </Layout>
    </Container>
  );
};

export default EditPlan;