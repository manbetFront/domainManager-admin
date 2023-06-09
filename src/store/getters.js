const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  whiteData: state => state.order.whiteData,
  siteDataArr: state => state.user.siteDataArr,
  alarmReportMqttData: state => state.order.reportMqtt,
  alarmFixMqttData: state => state.order.fixMqtt,
  hasAlarmReport: state => state.order.hasAlarmReport,
  hasAlarmFixData: state => state.order.hasAlarmLog,
  alarmHandleId: state => state.order.alarmHandleId,
}
export default getters
