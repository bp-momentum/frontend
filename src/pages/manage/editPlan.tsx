import React, { createRef, Key, useEffect } from "react";
import { Card, Col, InputNumber, Layout, Row, Space, Button, Modal, Input, message, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import Container from "../../shared/container";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { t } from "i18next";
import Translations from "../../localization/translations";
import { Header } from "antd/lib/layout/layout";
import api from "../../util/api";
import Routes from "../../util/routes";
import { Params, RouteProps, useParams } from "react-router-dom";

const { Sider, Content } = Layout;
const { confirm } = Modal;

interface ExerciseType {
  id: number;
  name: string;
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

const VisibleExercise = ({card, details, collapsed}: {card: ExerciseData, details: boolean, collapsed: boolean}) => {
  const changeSets = (value: number) => {
    card.sets = value;
  };
  const changeRepeats = (value: number) => {
    card.repeats = value;
  };

  return (
    <Card title={
      <div style={{display: "flex", alignItems: "center"}}>
        <h1 style={{margin: "0"}}>{card.type.name}</h1>
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

let openState: string;
let setOpenState: (id: string) => void;

type EditPlanProps = {
  params: Readonly<Params<string>>;
};
type EditPlanState = {
  name: string;
  count: number;
  loaded: boolean;
  storeItems: ExerciseCardData[];
  monday: ExerciseCardData[];
  tuesday: ExerciseCardData[];
  wednesday: ExerciseCardData[];
  thursday: ExerciseCardData[];
  friday: ExerciseCardData[];
  saturday: ExerciseCardData[];
  sunday: ExerciseCardData[];
  saveModalVisible: boolean;
  openState: string;
};

class EditPlan extends React.Component<EditPlanProps, EditPlanState> {
  StoreSider: React.RefObject<HTMLDivElement>;
  GarbageSider: React.RefObject<HTMLDivElement>;

  constructor(props: EditPlanProps) {
    super(props);
    this.state = {
      name: "",
      count: 0,
      loaded: false,
      storeItems: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      saveModalVisible: false,
      openState: "",
    };
 
    setOpenState = (id: string) => {
      console.log(id);
      this.setState({openState: id});
    };
    
    this.StoreSider = React.createRef<HTMLDivElement>();
    this.GarbageSider =  React.createRef<HTMLDivElement>();
  }

  DropToState(drop: string): {get: ExerciseCardData[], set: (data: ExerciseCardData[]) => void} {
    switch (drop) {
    case "monday":
      return {get: this.state.monday, set: (data: ExerciseCardData[]) => this.setState({monday: data})};
    case "tuesday":
      return {get: this.state.tuesday, set: (data: ExerciseCardData[]) => this.setState({tuesday: data})};
    case "wednesday":
      return {get: this.state.wednesday, set: (data: ExerciseCardData[]) => this.setState({wednesday: data})};
    case "thursday":
      return {get: this.state.thursday, set: (data: ExerciseCardData[]) => this.setState({thursday: data})};
    case "friday":
      return {get: this.state.friday, set: (data: ExerciseCardData[]) => this.setState({friday: data})};
    case "saturday":
      return {get: this.state.saturday, set: (data: ExerciseCardData[]) => this.setState({saturday: data})};
    case "sunday":
      return {get: this.state.sunday, set: (data: ExerciseCardData[]) => this.setState({sunday: data})};
    case "store": default:
      return {get: this.state.storeItems, set: (data: ExerciseCardData[]) => this.setState({storeItems: data})};
    }
  }

  // reorder all lists after drag and drop
  reorder(
    listLeave: ExerciseCardData[],
    listJoin: ExerciseCardData[],
    source: DraggableLocation,
    dest: DraggableLocation): {leave: ExerciseCardData[], join: ExerciseCardData[]} {

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
      this.setState({count: this.state.count + 1});
      const data = leaveArr[source.index].data;
      const item = {id: `exercise-${this.state.count}`, data: {...data}};
      joinArr.splice(dest.index, 0, item);
      return {leave: leaveArr, join: joinArr};
    }

    // move from list to list (not store)
    const item = leaveArr.splice(source.index, 1)[0];
    joinArr.splice(dest.index, 0, item);
    return {leave: leaveArr, join: joinArr};
  }

  componentDidMount(): void {
    setTimeout(() => {
      // load exercises from server

      api.execute(Routes.getExercises({})).then((response) => {
        console.log(response);
        if (!response.success) return;
        const storeItems = response.data.exercise_list.map((item: any) => (
          {id: `store-${item.id}`, data: {
            type: {id: item.id, name: item.title},
            description: "string",
            sets: 1,
            repeats: 1,
          }}
        ));
        this.setState({storeItems: storeItems});
      });

      const { planId } = this.props.params;

      if (!this.state.loaded && planId && planId !== "new") {
        this.setState({loaded: true});
        console.log("Loading plan", planId);
        api.execute(Routes.getTrainingPlan({planId: planId})).then(response => {
          if (!response.success) return;
          this.setState({name: response.data.name});
          response.data.exercises.forEach((element: any, i: number) => {
            const item = {id: `restored-${i}`, data: {
              type: {id: 1, name: "Squat"},
              sets: element.sets,
              repeats: element.repeats_per_set}};
            this.DropToState(element.date).set(this.DropToState(element.date).get.concat(item));
          });
        });
      }
    }, 500);  // wait for token to load
  }

  onDragEnd(result: DropResult): void {
    console.log(this);
    if (this.GarbageSider?.current)
      this.GarbageSider.current.style.display = "none";

    if (!result.destination) {
      return;
    }

    const {join, leave} = this.reorder(
      this.DropToState(result.source.droppableId).get,
      this.DropToState(result.destination.droppableId).get,
      result.source,
      result.destination
    );
    this.DropToState(result.source.droppableId).set(leave);
    this.DropToState(result.destination.droppableId).set(join);
  }

  save(): void {
    // TODO save plan
    message.success(t(Translations.planEditor.saveSuccess));
  }

  savePlan(): void {
    if (!this.state.name) {
      this.setState({saveModalVisible: true});
    }
    else {
      this.save();
    }
  }

  deletePlan(): void {
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
  }

  render(): React.ReactElement {
    return (
      <Container
        currentPage="manage"
        color="blue"
      >
        <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
          <DragDropContext onDragEnd={(result) => this.onDragEnd(result)} onDragStart={()=> {
            if (this.GarbageSider.current)
              this.GarbageSider.current.style.display = "block";
          }}>
            <Sider 
              ref={this.StoreSider}
              style={{background: "#e0e0e0", padding: "0", paddingTop: "20px"}} width="220px">
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
                        {this.state.storeItems.map((item, index) => (
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
              ref={this.GarbageSider}
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
                    value={this.state.name}
                    bordered={false}
                    onChange={change => {
                      this.setState({name: change.target.value});
                    }} />
                  <Space style={{marginLeft: "auto"}} >
                    <Button type="primary" onClick={this.savePlan}>{t(Translations.confirm.save)}</Button>
                    <Modal
                      visible={this.state.saveModalVisible}
                      title={t(Translations.planEditor.savePlanMissingName)}
                      okText={t(Translations.confirm.save)}
                      okType="primary"
                      okButtonProps={{
                        disabled: this.state.name === "",
                      }}
                      cancelText={t(Translations.confirm.cancel)}
                      onOk={() => {
                        this.setState({saveModalVisible: false});
                        this.savePlan();
                      }}
                      onCancel={() => {
                        this.setState({saveModalVisible: false});
                      }}
                    >
                      <Input placeholder="Name" value={this.state.name} onChange={(change) => {
                        this.setState({name: change.target.value});
                      }}/>
                    </Modal>
                    <Button danger onClick={this.deletePlan}>{t(Translations.confirm.delete)}</Button>
                  </Space>
                </Header>
                <Content style={{display: "flex", width: "100%", padding: "10px", paddingTop: "20px", overflow: "auto"}}>
                  <Row
                    style={{width: "100%", alignContent: "flex-start"}}
                    justify="center"
                    gutter={16}
                  >
                    <Day list={this.state.monday} name="monday" displayName={t(Translations.weekdays.monday)}></Day>
                    <Day list={this.state.tuesday} name="tuesday" displayName={t(Translations.weekdays.tuesday)}></Day>
                    <Day list={this.state.wednesday} name="wednesday" displayName={t(Translations.weekdays.wednesday)}></Day>
                    <Day list={this.state.thursday} name="thursday" displayName={t(Translations.weekdays.thursday)}></Day>
                    <Day list={this.state.friday} name="friday" displayName={t(Translations.weekdays.friday)}></Day>
                    <Day list={this.state.saturday} name="saturday" displayName={t(Translations.weekdays.saturday)}></Day>
                    <Day list={this.state.sunday} name="sunday" displayName={t(Translations.weekdays.sunday)}></Day>
                  </Row>
                </Content>
              </Layout>
            </Content>
          </DragDropContext>
        </Layout>
      </Container>
    );
  }
}

// This is required to use the params hook.
// (It only works in functional components)
const EditPlanWrapper = (): JSX.Element => {
  const params = useParams();

  return (
    <EditPlan params={params} />
  );
};

export default EditPlanWrapper;