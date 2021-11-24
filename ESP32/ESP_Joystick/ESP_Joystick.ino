const int analogInPin = 12;  // Analog input pin that the potentiometer is attached to

int sensorValue = 0;        // value read from the pot

void setup() {
  Serial.begin(115200);

}

void loop() {
  sensorValue = map(analogRead(analogInPin), 0, 1023, 0, 255);
  // change the analog out value:

  // print the results to the Serial Monitor:

  if(sensorValue == 1021)
  {
    Serial.println("up");
  }
  else if(sensorValue == 0)
  {
    Serial.println("down");
  }
  else
  {
    Serial.print("sensor = ");
    Serial.println(sensorValue);
  }

  // wait 2 milliseconds before the next loop for the analog-to-digital
  // converter to settle after the last reading:
}
