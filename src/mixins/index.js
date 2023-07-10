import store from '@/store'
import mqtt from 'mqtt';

export default {
  data() {
    return {
    }
  },
  methods: {
    indexNum(index) {
      const page = this.queryParams.page // 当前页码
      const pagesize = this.queryParams.size // 每页条数
      return index + 1 + (page - 1) * pagesize
    },

    createConnection(top) {
      this.client = mqtt.connect("wss://mqtt-ol.kletuzow.com:443/mqtt");
      var env = process.env.NODE_ENV === "development" ? "dev" : "pro";
      var topic = "domain-" + env + '/' + top;
      // 订阅
      this.client.on("connect", () => {
        this.client.subscribe(topic, (error) => {
          if (error) {
            console.error("Error:", error);
            return;
          }
          console.log("订阅成功", topic);
        });
      });

      // 重新连接
      this.client.on("reconnect", () => {
        this.client.subscribe(topic, (error) => {
          if (error) {
            console.error("Error:", error);
            return;
          }
          console.log("重新订阅成功", topic);
        });
      });

      // 回调
      this.client.on("message", (topic, message) => {
        const data = JSON.parse(message.toString());
        this.mqttCallback(topic, data);
      });
    },

    mqttCallback(topic, data){
      console.log('mqttCallback', topic, data)
      if(topic.indexOf('domain-manage-unhealthy-report') > -1){
        store.dispatch('order/setReportMqtt', data);
        this.$store.dispatch("order/getNumber3");
      }else if(topic.indexOf('domain-manage-unhealthy-fix/'+ store.getters.name) > -1){
        store.dispatch('order/setFixMqtt', data);
      }
    },

    // 接收 需要处理的异常
    mqttDomainReportList( isConnect ) {
      if(isConnect){
        this.createConnection('domain-manage-unhealthy-report');
      }
    },

    // 接收 回报人的异常回报被处理完 的提醒
    mqttDomainReportLog( isConnect ) {
      if(isConnect && store.getters.name){
        this.createConnection('domain-manage-unhealthy-fix/' + store.getters.name);
      }
    },
      

  }
}
