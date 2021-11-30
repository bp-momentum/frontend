import React, { CSSProperties } from "react";
import { Button, Card, Col, Layout, Row } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const { Sider, Content } = Layout;

interface ExerciseDate {
  id: string;
  name: string;
}

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    name: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties | undefined => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // border: `2px solid ${isDragging ? "lightblue" : "grey"}`,

  // styles we need to apply on draggables
  ...draggableStyle
});

const Exercise = ({item, index}: {key: string, item: ExerciseDate, index: number}) => {
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
          <Card title={item.name} bordered/>
        </div>
      )}
    </Draggable>
  );
  // TODO: leave something behind on left list
};

const ManagePlans = () : JSX.Element => {
  const [state, setState] = React.useState({ items: getItems(3) });

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      state.items,
      result.source.index,
      result.destination.index
    );
    setState({items});
  }

  return (
    <Layout style={{height: "100%", position: "absolute"}}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Sider style={{background: "#f0f0f0", padding: "10px", paddingTop: "20px"}}>
          <h1>Exercises</h1>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                // style={getListStyle(snapshot.isDraggingOver)}
              >
                {state.items.map((item, index) => (
                  <Exercise key={item.id} item={{...item}} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Row justify="center">
            <Col>
              {/* TODO: make button do smthn */}
              <Button type="primary" shape="circle" icon={<PlusOutlined />}  disabled />
            </Col>
          </Row>
        </Sider>
        <Content>
          Content
          {/* TODO: add droppable list for every day */}
        </Content>
      </DragDropContext>
    </Layout>
  );
};

export default ManagePlans;