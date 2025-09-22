import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import socket from "../socket"; //  import your socket instance

const ChatScreen = () => {
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");

  useEffect(() => {
    // listen for server messages
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, fromMe: false }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    // send to server
    socket.emit("sendMessage", input);

    // show in UI
    setMessages((prev) => [...prev, { text: input, fromMe: true }]);
    setInput("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.userName}>Chat</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.fromMe ? styles.messageRight : styles.messageLeft}
          >
            <Text
              style={[
                styles.messageText,
                { color: msg.fromMe ? "#fff" : "#000" },
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Box */}
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type a message..."
          placeholderTextColor={"#363636"}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: "#143444",
            paddingHorizontal: 20,
            justifyContent: "center",
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

//  Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#143444",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#DCEAF2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "75%",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#143444",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "75%",
  },
  messageText: {
    fontSize: 16,
  },
});
