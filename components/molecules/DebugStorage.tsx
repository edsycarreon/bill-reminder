import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import tw from "twrnc";
import {
  getAllStorageData,
  getAllStorageKeys,
  clearAllStorageData,
} from "../../utils/storageUtils";
import { useBillStore } from "../../stores/billStore";

export const DebugStorage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  const [storageKeys, setStorageKeys] = useState<readonly string[]>([]);
  const { _hasHydrated } = useBillStore();

  const refreshData = async () => {
    const keys = await getAllStorageKeys();
    const data = await getAllStorageData();
    setStorageKeys(keys);
    setStorageData(data);
  };

  useEffect(() => {
    if (modalVisible) {
      refreshData();
    }
  }, [modalVisible]);

  const handleClearStorage = async () => {
    await clearAllStorageData();
    await refreshData();
    alert("AsyncStorage has been cleared. Please restart the app.");
  };

  return (
    <>
      <TouchableOpacity
        style={tw`absolute bottom-4 left-4 flex-row items-center rounded-full bg-gray-800 px-3 py-2 opacity-70`}
        onPress={() => setModalVisible(true)}
      >
        <Text style={tw`text-xs text-white`}>Debug {_hasHydrated ? "✅" : "❌"}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`bg-opacity-50 flex-1 items-center justify-center bg-black`}>
          <View style={tw`max-h-5/6 w-11/12 rounded-lg bg-white p-4`}>
            <Text style={tw`mb-2 text-xl font-bold`}>AsyncStorage Debug</Text>
            <Text style={tw`mb-2`}>
              Hydration Status: {_hasHydrated ? "Hydrated ✅" : "Not Hydrated ❌"}
            </Text>

            <Text style={tw`mb-1 font-bold`}>Storage Keys ({storageKeys.length}):</Text>
            <View style={tw`mb-2 rounded bg-gray-100 p-2`}>
              {storageKeys.length > 0 ? (
                storageKeys.map((key) => (
                  <Text key={key} style={tw`text-xs`}>
                    {key}
                  </Text>
                ))
              ) : (
                <Text style={tw`text-xs italic`}>No keys found</Text>
              )}
            </View>

            <Text style={tw`mb-1 font-bold`}>Storage Data:</Text>
            <ScrollView style={tw`mb-4 h-56 rounded bg-gray-100 p-2`}>
              <Text style={tw`font-mono text-xs`}>{JSON.stringify(storageData, null, 2)}</Text>
            </ScrollView>

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity style={tw`rounded bg-blue-500 px-4 py-2`} onPress={refreshData}>
                <Text style={tw`text-white`}>Refresh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`rounded bg-red-500 px-4 py-2`}
                onPress={handleClearStorage}
              >
                <Text style={tw`text-white`}>Clear Storage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`rounded bg-gray-500 px-4 py-2`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white`}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
