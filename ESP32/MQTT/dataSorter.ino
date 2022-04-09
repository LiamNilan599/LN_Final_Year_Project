void dataSorter(String &Json, int i) {
  int idx1, idx2;
  String empName, role, ppsn;
  idx1 = Json.indexOf("name");
  idx2 = Json.indexOf(",", idx1);
  empName = Json.substring(idx1 + 7, idx2 - 1);
  idx1 = Json.indexOf("role");
  idx2 = Json.indexOf(",", idx1 + 1);
  role = Json.substring(idx1 + 7, idx2 - 1);
  idx1 = Json.indexOf("ppsn");
  idx2 = Json.indexOf(",", idx1 + 1);
  ppsn = Json.substring(idx1 + 7, idx2 - 1);
  nameList[i] = empName;
  roleList[i] = role;
  ppsnList[i] = ppsn;
}
