import React, { createRef } from "react";
import { Card, Col, InputNumber, Layout, Row, Space } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import Container from "../../shared/container";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

const { Sider, Content } = Layout;

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
  sets?: number;
  repeats?: number;
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

const VisibleExercise = ({card, details}: {card: ExerciseData, details: boolean}) => {
  const changeSets = (value: number) => {
    card.sets = value;
    redraw({});
    console.log(card);
  };
  const changeRepeats = (value: number) => {
    card.repeats = value;
    redraw({});
    console.log(card);
  };

  return (
    <Card title={
      card.type
    } bordered bodyStyle={{padding: "0px", }}>
      {details &&
        <Space direction="vertical" style={{margin: "20px"}}>
          <InputNumber value={card.repeats ?? 1} onChange={changeRepeats} addonAfter={<span># / Set</span>} min={1} max={100}/>
          <InputNumber value={card.sets ?? 1} onChange={changeSets} addonAfter={<span>Sets</span>} min={1} max={100}/>
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
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style, 
            userSelect: "none",
            margin: "0 0 8px 0", }}
        >
          <VisibleExercise card={item.data} details={details}/>
        </div>
      )}
    </Draggable>
  );
};

const Day = ({list, name}: {list: ExerciseCardData[], name: string}) => {
  return (
    <Col>
      <h1>
        {name[0].toUpperCase() + name.substr(1)}
      </h1>
      <Row style={{position: "relative"}}>
        <Droppable droppableId={name}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{background: "#fff", width: "200px", minHeight: "200px", padding: "10px", maxHeight: "500px", overflowY: "auto", overflowX: "hidden"}}
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
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "180px",
            padding: "20px",
            textAlign: "center",
            border: "2px dashed gray",
            borderRadius: "20px",
            userSelect: "none"}}>
            Add exercises to this day by dragging them from the left list
          </div>
        }
      </Row>
    </Col>
  );
};

let redraw: React.Dispatch<React.SetStateAction<Record<string, never>>>;

const ManagePlans = () : JSX.Element => {
  const [count, setCount] = React.useState(0);

  const [storeItems, setStoreItems] = React.useState<ExerciseCardData[]>(
    Object.values(ExerciseType).map(e => {
      console.log(e);
      return {
        id: e,
        data: {
          type: e,
          description: "string",
        }};
    }));
  const [monday, setMonday] = React.useState<ExerciseCardData[]>([]);
  const [tuesday, setTuesday] = React.useState<ExerciseCardData[]>([]);
  const [wednesday, setWednesday] = React.useState<ExerciseCardData[]>([]);
  const [thursday, setThursday] = React.useState<ExerciseCardData[]>([]);
  const [friday, setFriday] = React.useState<ExerciseCardData[]>([]);
  const [saturday, setSaturday] = React.useState<ExerciseCardData[]>([]);
  const [sunday, setSunday] = React.useState<ExerciseCardData[]>([]);

  [, redraw] = React.useState({});

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

  function onDragEnd(result: DropResult) {
    if (GarbageSider.current)
      GarbageSider.current.style.display = "none";

    console.log(result);

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
  }

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
            style={{background: "#e0e0e0", padding: "20px 0"}} width="220px">
            <div
              style={{height: "100%", display: "flex", flexDirection: "column"}}>
              <h1 style={{padding: "0 10px"}}>Exercises</h1>
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
                Delete Exercises by moving them here!
              </div>
            </div>
          </Sider>
          <Content style={{display: "flex", width: "100%", padding: "10px", paddingTop: "20px", overflow: "auto"}}>
            <Row
              style={{width: "100%"}}
              justify="center"
              gutter={16}
            >
              <Day list={monday} name="monday"></Day>
              <Day list={tuesday} name="tuesday"></Day>
              <Day list={wednesday} name="wednesday"></Day>
              <Day list={thursday} name="thursday"></Day>
              <Day list={friday} name="friday"></Day>
              <Day list={saturday} name="saturday"></Day>
              <Day list={sunday} name="sunday"></Day>
            </Row>
          </Content>
        </DragDropContext>
      </Layout>
    </Container>
  );
};

export default ManagePlans;