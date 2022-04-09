void publishMessage(String topic, String empName)
{
  StaticJsonDocument<200> doc;
  char jsonBuffer[512];
  if (topic.equals("TeamSwipe_ESP32/request-employee-array"))
  {
    doc["email"] = "Folens@2.com";
    serializeJson(doc, jsonBuffer); // print to mqtt_client
  }
  else
  {
    doc["email"] = "Folens@2.com";
    doc["name"] = empName;
    serializeJson(doc, jsonBuffer); // print to mqtt_client
  }
  //Publish to the topic
  mqtt_client.publish(topic, jsonBuffer);
}
