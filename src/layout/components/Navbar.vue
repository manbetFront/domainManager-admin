<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-popover v-if="getNumber() > 0" placement="bottom" width="280" trigger="hover">
          <div class="pop-div">
            <div v-if="getNum1() > 0">
              <span @click="goPromotionDomain()" class="pop-span">有{{ getNum1() }}个推广域名即将到期</span>
            </div>
            <el-divider v-if="getNum1() > 0 && getNum2() > 0"></el-divider>
            <div v-if="getNum2() > 0">
              <span @click="goJumpDomain()"  class="pop-span">有{{ getNum2() }}个跳转域名即将到期</span>
               <el-divider />
            </div>
            <div v-for="item in unReadMsgReportData" :key="item.id" class="pop-ques" @click="goReportList(item)">
              <p>问题#{{ item.rid }} 待处理：</p>
              <p>域名：{{ item.host }}</p>
              <p>问题描述：{{ item.remark }}</p>
              <el-divider />
            </div>
            <div v-for="item in unReadMsgLogData" :key="item.id" class="pop-ques" @click="goReportLog(item)">
              <p>问题#{{ item.rid }} 已处理：</p>
              <p>域名：{{ item.host }}</p>
              <p>问题描述：{{ item.remark }}</p>
              <p>处理结果备注：{{ item.result }}</p>
              <el-divider />
            </div>
          </div>
          <div slot="reference" class="info-box">
            <el-badge :value="getNumber()" class="item">
              <span class="info">
                <i class="el-icon-message-solid"></i>
              </span>
            </el-badge>
          </div>
        </el-popover>
        <div v-else slot="reference" class="info-box">
            <span class="info">
              <i class="el-icon-message-solid"></i>
            </span>
        </div>
        <!-- <search id="header-search" class="right-menu-item" />

        <el-tooltip content="下载源码" effect="dark" placement="bottom">
          <ruo-yi id="ruoyi" class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item> 用户名：{{ name }} </el-dropdown-item>
          <el-dropdown-item>
            角色：

            <span class="role">{{ role }}</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item>
            <span @click="setting = true">布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided>
            <span @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getUnreadMsg, reportReadMsg } from "../../api/theme/index"
import { getRole, getUser } from "@/utils/auth";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYi from "@/components/RuoYi";
import { mapState } from "vuex";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYi,
  },

  data() {
    return {
       unReadMsgReportData: [],
       unReadMsgReportNums: 0,

       unReadMsgLogData: [],
       unReadMsgLogNums: 0,
    }
  },

  computed: {
    ...mapGetters(["sidebar", "avatar", "device", 
      "hasAlarmReport", "hasAlarmFixData", "alarmHandleId",
      "alarmReportMqttData", "alarmFixMqttData"
      ]),

    ...mapState(["order"]),

    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    name() {
      return getUser();
    },
    role() {
      return decodeURIComponent(getRole());
    },
  },

  watch: {
    hasAlarmReport: {
      handler(newVal, oldVal){
        if(newVal){//有 异常回报列表 权限
           this.getReportUnreadMsgList();
        }
      }
    },

    hasAlarmFixData: {
      handler(newVal, oldVal){
        if(newVal){//有 域名回报处理日志 权限
           this.getLogUnreadMsgList();
        }
      }
    },

    alarmReportMqttData: {
      handler(newVal, oldVal){
        if(newVal){//异常回报列表 mqtt
           this.unReadMsgReportData = this.unReadMsgReportData.concat(newVal);
           this.unReadMsgReportNums += newVal.length;
        }
      }
    },

    alarmFixMqttData: {
      handler(newVal, oldVal){
        if(newVal){//域名回报处理日志 mqtt
           this.unReadMsgLogData = this.unReadMsgLogData.concat(newVal);
           this.unReadMsgLogNums += newVal.length;
        }
      }
    },

    alarmHandleId: {//在 异常回报列表 已经处理异常，需要把提醒里的对应数据删掉
       handler(newVal, oldVal){
        console.log('alarmHandleId', newVal)
        if(newVal && newVal > 0){
           this.updateReportReadMsg(newVal);
        }
      }
    }
 },

  created(){
   
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("FedLogOut").then(() => {
          location.reload();
        });
      });
    },

    //获取 有异常回报列表权限的运维，未读消息
    getReportUnreadMsgList() {
      getUnreadMsg({user_type: 2})
        .then(response => {
          if (response.code === 200) {
            this.unReadMsgReportData = response.msg || [];
            this.unReadMsgReportNums = response.msg ? response.msg.length : 0;
          }
        })
    },

     //获取有 域名回报处理日志 权限的用户，未读消息
    getLogUnreadMsgList() {
      getUnreadMsg({user_type: 1})
        .then(response => {
          if (response.code === 200) {
            this.unReadMsgLogData = response.msg || [];
            this.unReadMsgLogNums = response.msg ? response.msg.length : 0;
          }
        })
    },
    
    goPromotionDomain(){
      this.$router.push("/domainAdmin/promotion" );
    },

    goJumpDomain(){
      this.$router.push("/domainAdmin/jumpmain" );
    },

    //跳转到 异常回报列表
    goReportList(item){
      reportReadMsg({rid: item.rid})
      .then(response => {
        if (response.code === 200) {
          console.log('查看消息')
          this.getReportUnreadMsgList();
        }
      })
      this.$router.push("/alarmAdmin/reportList" );
    },

    //跳转到 域名回报处理日志
    goReportLog(item){
      reportReadMsg({rid: item.rid})
        .then(response => {
          if (response.code === 200) {
            console.log('查看消息')
            this.getLogUnreadMsgList();
          }
        })
      this.$router.push("/alarmAdmin/reportLog" );
    },

    //消息变为已读
    updateReportReadMsg(id){
      var item = this.unReadMsgReportData.find(f => f.id === id+'');
      if(item){
        reportReadMsg({rid: item.rid})
          .then(response => {
            if (response.code === 200) {
              console.log('查看消息')
              this.getReportUnreadMsgList();
            }
          })
      }
    },

    getNumber() {
      return (this.order.numData1 + this.order.numData2 + this.unReadMsgReportNums + this.unReadMsgLogNums)|| "0";
    },

    getNum1() {
      return this.order.numData1 || 0;
    },

    getNum2() {
      return this.order.numData2 || 0;
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .info-box {
      display: inline-block;
      line-height: 50px;
      margin: 0 10px;
      font-size: 20px;
      .info {
        cursor: pointer;
        .el-icon-message-solid{
          font-size: 30px;
        }
      }
    }

    .el-badge {
      line-height: 1;
    }


    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.role {
  width: 80px;
  display: inline-block;
  word-break: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: bottom;
}

.pop-div{
  .pop-span{
    cursor: pointer;
    line-height: 15px;
  }
  .pop-ques{
    cursor: pointer;
  }
}
.el-divider--horizontal{
  margin: 14px 0;
}
</style>
