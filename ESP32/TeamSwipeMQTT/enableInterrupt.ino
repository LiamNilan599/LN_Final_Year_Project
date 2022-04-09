void enableInterrupt() {
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 250000, true);
  timerAlarmEnable(timer);
}
