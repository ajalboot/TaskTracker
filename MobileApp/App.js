import { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import {
  createUpdateTaskee,
  fetchTaskee,
  getAddressData,
  removeTaskee,
} from "./api";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [myLocation, setMyLocation] = useState(null);

  const addTaskHandler = async () => {
    if (task)
      await createUpdateTaskee({
        task,
        addressData: JSON.stringify(myLocation),
      }).then(() => {
        setTask("");
      });
    await getAllTaskee();
  };

  const completeTaskHandler = async (taskItem) => {
    await getAllTaskee();
    await getAllTaskee();
    const { result } = await createUpdateTaskee({
      id: taskItem.id,
      completed: true,
      addressData: JSON.stringify(myLocation),
    });
    await getAllTaskee();
  };

  const deleteTaskHandler = async (taskId) => {
    const { result } = await removeTaskee(taskId);
    await getAllTaskee();
  };

  const getAllTaskee = async () => {
    const { result } = await fetchTaskee();
    setTasks(result.sort((a, b) => b.id - a.id));
  };

  useEffect(() => {
    let subscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      subscription = await Location.watchPositionAsync(
        { distanceInterval: 10 },
        async (newPosition) => {
          const location = await getAddressData(newPosition.coords);
          setMyLocation(location?.address);
          await getAllTaskee();
        }
      );
    })();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View className="flex-1 pt-24 pb-16 px-4">
      <View className="flex-row justify-between mb-4">
        <TextInput
          className="flex-1 border border-1 border-chineseSilver mr-2 px-2"
          placeholder="Enter your task!"
          onChangeText={(enteredTask) => setTask(enteredTask)}
          value={task}
        />
        <View className="rounded bg-green-200 ml-1">
          <Button title="+" onPress={addTaskHandler} />
        </View>
        <View className="rounded bg-blue-300 ml-2">
          <Button title="↻" onPress={getAllTaskee} />
        </View>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View className={`flex-row`} key={item?.id}>
            <View
              className={`flex-1 ${
                item?.completed ? "bg-gray-600" : "bg-interdimensionalBlue"
              } my-2 mr-2 p-2 rounded`}
            >
              <Text
                onPress={() => completeTaskHandler(item)}
                className={`text-white capitalize font-bold ${
                  item?.completed ? "line-through" : ""
                }`}
              >
                {item?.task}
              </Text>
              <Text
                className={`text-white capitalize text-right`}
                onPress={() => completeTaskHandler(item)}
              >
              {item?.completed && 
                (item?.addressData?.road || item?.addressData?.aeroway || item?.addressData?.neighbourhood) +' '+
                 (item?.addressData?.house_number || item?.addressData?.shop)+', '+
                (item?.addressData?.postcode) +', '+
                (item?.addressData?.town || item?.addressData?.city || item?.addressData?.municipality )
              }
              </Text>
            </View>
            <View className="my-2 bg-red-400 rounded justify-center content-center">
              <Text
                className="m-2 p-1 text-xs"
                onPress={() => deleteTaskHandler(item?.id)}
              >
                ❌
              </Text>
            </View>
          </View>
        )}
        alwaysBounceVertical
        className="py-4 border-t-2 border-chineseSilver"
      />
    </View>
  );
}
