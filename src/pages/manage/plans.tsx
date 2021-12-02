import React, { CSSProperties } from "react";
import { Button, Card, Col, Layout, Row } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import Container from "../../shared/container";

const { Sider, Content } = Layout;

class ExerciseData {
  name: string | null = null;
  description: string | null = null;
}

interface ExerciseCardDate {
  id: string;
  data: ExerciseData;
}

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    data: new ExerciseData()
  }));

// a little function to help us with reordering the result
const reorder = (listLeave: any[], listJoin: any[], startIndex: number, endIndex: number) => {
  const result1 = Array.from(listLeave);
  const result2 = Array.from(listJoin);
  const [removed] = result1.splice(startIndex, 1);
  if (listLeave === listJoin) {
    result1.splice(endIndex, 0, removed);
  } else {
    result2.splice(endIndex, 0, removed);
  }
  return {leave: result1, join: result2};
};

const grid = 8;
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties | undefined => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,
  ...draggableStyle
});

const Exercise = ({item, index}: {item: ExerciseCardDate, index: number}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <Card title={item.data?.name} bordered/>
        </div>
      )}
    </Draggable>
  );
  // TODO: leave something behind on left list
};

const Day = ({list, name}: {list: any[], name: string}) => {
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
  const [storeItems, setStoreItems] = React.useState( getItems(0));
  const [monday, setMonday] = React.useState( getItems(0));
  const [tuesday, setTuesday] = React.useState( getItems(0));
  const [wednesday, setWednesday] = React.useState( getItems(0));
  const [thursday, setThursday] = React.useState( getItems(0));
  const [friday, setFriday] = React.useState( getItems(0));
  const [saturday, setSaturday] = React.useState( getItems(0));
  const [sunday, setSunday] = React.useState( getItems(0));

  const [count, setCount] = React.useState(0);

  function DropToState(drop: string) {
    switch (drop) {
    case "store":
      return {get: storeItems, set: setStoreItems};
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
    default:
      return {get: storeItems, set: setStoreItems};
    }
  }

  function addCard() {
    setCount(count + 1);
    setStoreItems(storeItems.concat({id: `item-${count}`, data: {name: `New Exercise ${count}`, description: "Description"}}));
  }

  function onDragEnd(result: DropResult) {
    console.log(result);

    if (!result.destination) {
      return;
    }

    const {join, leave} = reorder(
      DropToState(result.source.droppableId).get,
      DropToState(result.destination.droppableId).get,
      result.source.index,
      result.destination.index
    );
    if (result.source.droppableId === result.destination.droppableId) {
      DropToState(result.source.droppableId).set(leave);
    }
    else {
      DropToState(result.source.droppableId).set(leave);
      DropToState(result.destination.droppableId).set(join);
      const dat = join[result.destination.index].data;
      if (result.source.droppableId === "store") {
        setCount(count + 1);
        setStoreItems(leave.concat({id: `item-${count}`, data: dat}));
      }
    }
  }

  return (
    <Container
      currentPage="leaderboard"
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