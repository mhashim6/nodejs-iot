#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <ESP8266WiFi.h>


WebSocketsClient NodeWSocket;

#define SERVER "wss://iot-chat-mhashim6.herokuapp.com/"
#define PORT 80
#define URL "/"

DynamicJsonDocument doc(200);

void websocketEvent(WStype_t type, uint8_t *data, size_t length) {
  switch (type) {
    case (WStype_CONNECTED):
      Serial.printf("Device is COnnected");
      NodeWSocket.sendTXT("{\"msgType\":\"auth\",\"userType\":\"HardWare\",\"username\":\"NodeMCU\"}");
      break;

    case (WStype_TEXT):
      deserializeJson(doc, data);
      JsonObject deliveredMessage = doc.as<JsonObject>();
      //int led = deliveredMessage["led"].as<int>();
      int led = deliveredMessage[String("led")];
      int outPutN = led + 4;
      digitalWrite(outPutN, !digitalRead(outPutN));
      char *sentMessage;
      sprintf(sentMessage, "{\"msgType\":\"control\",\"led\":\"%d\"}", outPutN);
      NodeWSocket.sendTXT(sentMessage);
  }
}


const char *ssid = "";
const char *password = "";

const int outPut4 = 4;
const int outPut5 = 5;
const int outPut6 = 6;

void setup() {
  Serial.begin(115200);

  pinMode(outPut4, OUTPUT);
  pinMode(outPut5, OUTPUT);
  pinMode(outPut6, OUTPUT);

  digitalWrite(outPut4, LOW);
  digitalWrite(outPut5, LOW);
  digitalWrite(outPut6, LOW);

  Serial.print("Connecting To...");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("WiFi is Connected");
  Serial.print("IP Address:");
  Serial.println(WiFi.localIP());
  NodeWSocket.begin(SERVER, PORT, URL);
  NodeWSocket.onEvent(websocketEvent);
  NodeWSocket.setReconnectInterval(1000);

}

void loop() {
  NodeWSocket.loop();
}
