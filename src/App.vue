<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from '@/store'

export default {
  name: "App",

  computed: {
    ...mapGetters(['permission_routes']),
  },

  watch: {
    permission_routes: {
      handler(newVal, oldVal){
        this.permissionMenu()
      }
    }
 },

  methods: {
    permissionMenu(){
       // mqtt需订阅的
        const alarmAdminData = this.permission_routes.filter(item => item.name == 'AlarmAdmin')
        if(alarmAdminData.length > 0){
          //检测是否有 警报管理--异常回报列表
          const reportList = alarmAdminData[0].children.filter(item => item.name == 'ReportList')
          if(reportList.length > 0){
            setTimeout(() => {
              this.mqttDomainReportList(true);
              store.dispatch('order/setHasAlarmReport', true);
            }, 1000);
          }
           //检测是否有 警报管理--域名回报处理日志
          const reportLog = alarmAdminData[0].children.filter(item => item.name == 'ReportLog')
          if(reportLog.length > 0){
            setTimeout(() => {
              this.mqttDomainReportLog(true);
              store.dispatch('order/setHasAlarmLog', true);
            }, 1000);
          }
        }
    },

  }
};
</script>
<style lang="stylus">
.point-icon {
  font-size 18px
  &.is-success {
    color #00A854
  }
  &.is-error {
    color rgb(217, 0, 27)
  }
  &.is-gray {
    color gray
  }
}

</style>
