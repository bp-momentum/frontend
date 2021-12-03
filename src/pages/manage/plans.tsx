import React from "react";
import { Button, Card, Col, Layout, Row } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import Container from "../../shared/container";

const { Sider, Content } = Layout;

// get from API later
enum ExerciseType {
  Squat = "Squat",
  Pushup = "Pushup",
}

class ExerciseData {
  id: string;
  type: ExerciseType;
  description: string;

  constructor(id: string, {type=ExerciseType.Squat, description=""}={}) {
    this.id = id;
    this.type = type;
    this.description = description;
  }
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
  const fromStore = source.droppableId === "store";   // false
  const toStore = dest.droppableId === "store";       // false

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
    const item = {id: `exercise-${count}`, data: leaveArr[source.index].data};
    joinArr.splice(dest.index, 0, item);
    return {leave: leaveArr, join: joinArr};
  }

  // move from list to list (not store)
  const item = leaveArr.splice(source.index, 1)[0];
  joinArr.splice(dest.index, 0, item);
  return {leave: leaveArr, join: joinArr};
};

const Exercise = ({item, index}: {item: ExerciseCardData, index: number}) => {
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
          <Card title={item.data?.type} bordered>
            {item.data?.type}
          </Card>
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
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{background: "#fff", width: "200px", minHeight: "200px", padding: "10px"}}
            >
              {list.map((item, index) => (
                <Exercise key={item.id} item={{...item}} index={index} />
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

const ManagePlans = () : JSX.Element => {
  const [storeItems, setStoreItems] = React.useState<ExerciseCardData[]>([]);
  const [monday, setMonday] = React.useState<ExerciseCardData[]>([]);
  const [tuesday, setTuesday] = React.useState<ExerciseCardData[]>([]);
  const [wednesday, setWednesday] = React.useState<ExerciseCardData[]>([]);
  const [thursday, setThursday] = React.useState<ExerciseCardData[]>([]);
  const [friday, setFriday] = React.useState<ExerciseCardData[]>([]);
  const [saturday, setSaturday] = React.useState<ExerciseCardData[]>([]);
  const [sunday, setSunday] = React.useState<ExerciseCardData[]>([]);

  const [count, setCount] = React.useState(0);

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
    case "store": default:
      return {get: storeItems, set: setStoreItems};
    }
  }

  function addCard() {
    setCount(count + 1);
    setStoreItems(storeItems.concat({id: `exercise-${count}`,
      data: new ExerciseData(`exercise-${count}`, {
        description: "Description",
        type: ExerciseType.Pushup,
      })}
    ));
  }

  function onDragEnd(result: DropResult) {
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Sider 
            style={{background: "#e0e0e0", padding: "20px 0"}} width="220px">
            <div
              style={{height: "100%", display: "flex", flexDirection: "column"}}>
              <h1 style={{padding: "0 10px"}}>Exercises</h1>
              <div style={{overflow: "auto", padding: "0 10px"}} >
                {storeItems.length === 0 && 
                  <div style={{
                    padding: "20px",
                    width: "200px",
                    textAlign: "center",
                    border: "2px dashed gray",
                    borderRadius: "20px",
                    userSelect: "none"
                  }}>Create Exercices By Clicking Below!</div>
                }
                {storeItems.length !== 0 && 
                  <Droppable droppableId="store">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{minHeight: "100px"}}
                      >
                        {storeItems.map((item, index) => (
                          <Exercise key={item.id} item={{...item}} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                }
              </div>
              <Row justify="center" style={{paddingTop: "10px"}}>
                <Col>
                  {/* TODO: make button do smthn */}
                  <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={addCard} />
                </Col>
              </Row>
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