import { useDrag, useDrop } from "react-dnd";
import "./App.css";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";

const ConfContext = createContext();

const ItemTypes = {
  CARD: "card",
};

const ActionTypes = {
  ADD: "ADD",
  UPDATE: "UPDATE",
};

const hours = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  // "14:00",
  // "15:00",
  // "16:00",
  // "17:00",
  // "18:00",
  // "18:00",
  // "19:00",
  // "20:00",
  // "21:00",
];

const confs = [
  {
    time: "10:30",
    duration: 180,
    title: "NextJs conf",
  },
];

const quarters = ["00", "15", "30", "45"];

const cards = [
  {
    id: 0,
    duration: 30,
    title: "React conf",
    color: "bg-red-400/10",
    borderColor: "border-red-400",
  },
  {
    id: 1,
    duration: 120,
    title: "Java conf",
    color: "bg-blue-400/10",
    borderColor: "border-blue-400",
  },
  {
    id: 2,
    duration: 60,
    title: "DevOps conf",
    color: "bg-yellow-400/10",
    borderColor: "border-yellow-400",
  },
  {
    id: 3,
    duration: 75,
    title: "HTML conf",
    color: "bg-green-400/10",
    borderColor: "border-green-400",
  },
];

const HoursColumn = () => {
  return (
    <div className="flex flex-col">
      {hours.map((hour, index) => (
        <div
          key={hour}
          className={`h-[120px] border w-48 flex items-center justify-center ${
            index % 2 == 0 ? "bg-gray-400/10" : ""
          }`}
        >
          <p>{hour}</p>
        </div>
      ))}
    </div>
  );
};

const PlannedEvent = ({
  title,
  height = 0,
  borderColor,
  backgroundColor,
  duration,
  cardId,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: cardId, action: ActionTypes.UPDATE },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className="px-2">
      <div
        ref={drag}
        className={`${backgroundColor} border ${borderColor} relative rounded-md p-3 w-full z-0 `}
        style={{ height: `${height * 2}px` }}
      >
        <p className="text-xl font-bold">{title}</p>
        <p className="">{duration}</p>
      </div>
    </div>
  );
};

const SubSlot = ({ time, conf, hour }) => {
  // console.log("timeSlot " + time + " => ", { conf });

  const { setConfsList, update } = useContext(ConfContext);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      // console.log("item => ", item, time, monitor);

      if (item.action === ActionTypes.UPDATE) {
        update(item.id, time);
      }
      // if it's not already mapped
      if (item.action === ActionTypes.ADD) {
        const target = cards.find((c) => c.id === item.id);
        if (target) {
          setConfsList((prev) => [...prev, { ...target, time }]);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  return (
    <div className={`w-full h-1/4 text-xs overflow-visible`}>
      {/* {conf && <div>{conf.title}</div>} */}
      {conf && (
        <PlannedEvent
          cardId={conf?.id}
          title={conf?.title}
          height={conf.duration}
          backgroundColor={conf.color}
          borderColor={conf.borderColor}
          duration={conf.duration}
        />
      )}
      <div
        ref={drop}
        className={`w-full h-full border border-dashed border-green-400 text-xs flex items-center justify-center relative ${
          isOver ? "z-1 opacity-100" : "z-0 opacity-0"
        }`}
      >
        {time}
      </div>
    </div>
  );
};

const HourSlot = ({ hour, index, confs }) => {
  // console.log("Hour => " + hour + " here => ", { confs });
  const getCurrentTimesConf = (quarter, confs) => {
    return confs?.find((c) => c.time?.split(":")[1] === quarter);
  };
  const currentHour = hour?.split(":")[0] || "00";
  return (
    <div
      // className={`h-[120px] border w-48 flex  flex-col ${
      //   index % 2 == 0 ? "bg-gray-400/10" : ""
      // }`}
      className={`h-[120px] border w-48 flex  flex-col ${
        index % 2 == 0 ? "bg-gray-400/10" : ""
      }`}
    >
      {quarters.map((minute) => (
        <SubSlot
          key={minute}
          hour={hour}
          time={`${currentHour}:${minute}`}
          conf={getCurrentTimesConf(minute, confs)}
        />
      ))}
    </div>
  );
};

const RoomPlanning = ({ confs }) => {
  const getCurrentHourEvents = (hour, allConfs) => {
    const currentHour = hour?.split(":")[0] || "00";
    return allConfs?.filter((e) => e.time?.split(":")[0] === currentHour);
  };

  return (
    <div className="flex flex-col">
      {hours.map((hour, index) => (
        <HourSlot
          key={hour}
          index={index}
          hour={hour}
          confs={getCurrentHourEvents(hour, confs)}
        />
      ))}
    </div>
  );
};

const Card = ({ title, color, borderColor, cardId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: cardId, action: ActionTypes.ADD },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`text-white py-2 px-10 border ${color} ${borderColor} rounded-md`}
    >
      <p>{title}</p>
    </div>
  );
};

function App() {
  const [confsList, setConfsList] = useState([]);

  console.log("=====> ", { confsList });

  const updatePlannedConf = (confId, time) => {
    console.log({ confId, time, confsList });
    const indexOfConf = confsList.findIndex((c) => c.id === confId);
    console.log({ indexOfConf });
    if (indexOfConf !== -1) {
      const newConfsList = [...confsList];
      newConfsList[indexOfConf] = { ...confsList[indexOfConf], time };
      console.log("oooo", { confsList, newConfsList });
      setConfsList(newConfsList);
    }
  };

  return (
    <ConfContext.Provider
      value={{ confsList, setConfsList, update: updatePlannedConf }}
    >
      <div className="py-20 px-20 ">
        <div className="flex border border-red-400 px-8 py-6 space-x-4">
          {cards.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              color={item.color}
              borderColor={item.borderColor}
              cardId={item.id}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-start">
          <HoursColumn />
          <RoomPlanning confs={confsList} />
          {/* <RoomPlanning />
        <RoomPlanning /> */}
        </div>
      </div>
    </ConfContext.Provider>
  );
}

export default App;
