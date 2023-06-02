<template>
  <div class="walletStyle">
    <div class="checkStyle">
      <!-- <el-switch
        v-model="statusDataIf"
        active-color="#13ce66"
        inactive-color="#ff4949"
        inactive-text="自动审核"
        @change="changeBox"
      /> -->
    </div>
    <!-- 搜索框 -->
    <search-form @submit="handleQuery" @resetQuery="resetQuery" />
    <!-- 分割线 -->
    <!-- <el-divider /> -->
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        :max-height="650"
      >
        <!-- <el-table-column type="index" label="序号" width="80" align="center" /> -->
        <el-table-column prop="order_id" label="代理线" align="center" />
        <el-table-column label="推广域名" align="center">
          <template slot-scope="scope">
            <div
              style="text-decoration: underline;cursor:pointer;color:#328DFF"
              @click.self="toUrl(scope.row.transaction_info)"
            >
              {{ scope.row.trade_no }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="跳转域名" align="center" />
        <el-table-column prop="apply_num" label="域名备注" align="center" />

        <el-table-column
          prop="created_at"
          label="创建时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="到期时间"
          width="180"
          align="center"
        />
        <el-table-column prop="created_at" label="总访问量" align="center" />
        <el-table-column prop="withdraw_from" label="总注册量" align="center" />
        <el-table-column
          prop="withdraw_address"
          label="收款地址"
          align="center"
        />
        <el-table-column
          fixed="right"
          prop="status"
          label="收款状态"
          width="180"
          align="center"
        >
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleCheck(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="handleEdit(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </div>
    <!-- 编辑 -->
    <edit-dialog ref="editDialog" />
    <!-- 提现 -->
    <carry-dialog ref="carryDialog" />
    <!-- 通知音效 -->
    <audio ref="dingdong" preload="metadata" src="~@/assets/dingdong.wav" />
  </div>
</template>

<script>
import mqtt from "mqtt";
import {
  orderCheckStatus,
  orderEditStatus,
  orderList
} from "@/api/theme/order/rate";
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import EditDialog from "./components/editDialog";
import CarryDialog from "./components/carryDialog";
import { getSiteData } from "@/utils/auth";
export default {
  // name: 'VirtualOrder',
  components: {
    SearchForm,
    Pagination,
    EditDialog,
    CarryDialog
  },
  props: {},
  data() {
    return {
      total: 0,
      setStatusData: {
        id: "",
        examine_type: 1
      },
      listQuery: {
        page: 1,
        page_size: 10
      },
      loading: false,
      statusDataIf: true,
      // maxHeight: 0,
      tableData: []
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    // this.detectMaxHeight()
    this.getExamineType();
    // 表格列表
    this.getList();
    // 创建mqtt链接
    this.createConnection();
  },

  methods: {
    // 跳转链接
    toUrl(url) {
      window.open(url);
    },
    // detectMaxHeight() {
    //   this.maxHeight = window.innerHeight - 300
    // },

    /** 订阅支付审核订单数 */
    createConnection() {
      // const { topic } = this.$store.state.order
      this.client = mqtt.connect("wss://mqtt.kletuzow.com:443/mqtt");
      // 订阅
      this.client.on("connect", () => {
        // console.log(getSiteData(),"===");
        // `platform=PHmerchantOrderList`
        this.client.subscribe(
          `platform=${getSiteData()}merchantOrderList`,
          error => {
            if (error) {
              console.error("Error:", error);
              return;
            }
            console.log("虚拟币订单审核订阅成功");
          }
        );
      });
      // 回调
      this.client.on("message", (topic, message) => {
        const data = JSON.parse(message.toString());
        console.log(topic, data, "接收回调数据");
        this.$notify({
          title: "提示",
          type: "warning",
          message: "您有新的虚拟币审核订单，请及时处理"
        });
        this.$nextTick(() => {
          this.$refs["dingdong"].play();
        });
        // this.$store.commit('order/SET_NUMS', data)
        // this.$store.dispatch('order/getNumber3')
        this.getList();
      });
    },

    getStatus(num) {
      if (num === 1) {
        return "未到账";
      }
      if (num === 2) {
        return "已到账";
      }
      if (num === 3) {
        return "未匹配";
      }
      if (num === 4) {
        return "成功";
      }
      if (num === 5) {
        return "成功,改过金额";
      }
      if (num === 6) {
        return "超时";
      }
      if (num === 7) {
        return "失败";
      }
    },
    // 切换状态
    // changeBox(item) {
    //   if (item) {
    //     this.setStatusData.examine_type = 1;
    //   } else {
    //     this.setStatusData.examine_type = 2;
    //   }
    //   this.setStatusType();
    // },
    // 设置审核状态
    async setStatusType() {
      const res = await orderEditStatus(this.setStatusData);
      if (res.status !== 200) {
        return this.$message(res.msg);
      }
      this.$message.success("操作成功");
      this.getExamineType();
    },
    async getExamineType() {
      const res = await orderCheckStatus();
      if (res.status !== 200) {
        return this.$message(res.msg);
      }
      this.setStatusData.id = res.data[0].id;
      if (res.data[0].examine_type === 1) {
        this.statusDataIf = true;
      } else {
        this.statusDataIf = false;
      }
    },

    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10
      };
      this.getList();
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10
      };
      this.listQuery = Object.assign(this.listQuery, param);
      this.getList();
    },
    // 查询列表
    getList() {
      this.loading = true;
      this.$store.dispatch("order/getNumber3");
      orderList({ ...this.listQuery })
        .then(response => {
          if (response.status === 200) {
            const data = response.data || [];
            this.tableData = data.data;
            this.total = data.total;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    handleEdit(rowData) {
      this.$refs.editDialog.open(rowData);
    },
    // 审核
    handleCheck(rowData) {
      this.$refs.carryDialog.open(rowData);
    }
  }
};
</script>
<style lang="scss" scoped>
.walletStyle {
  padding: 25px;

  // 自动审核样式
  .checkStyle {
    padding: 0 0 20px 0;
  }

  // height: 100%;
  min-height: calc(100vh - 84px);
  padding-top: 20px;
  position: relative;

  .tableStyle {
    // padding: 0 20px;
    // height: calc(100vh - 320px);
    // overflow-y: auto;
    margin-bottom: 30px;

    .rowStyle {
      text-align: right;
      margin-bottom: 20px;
    }
  }

  .page-fixed-static {
    color: #646566;
    background-color: #f8fff5;
    position: absolute;
    bottom: 52px;
    left: 0;
    right: 0;
    font-size: 14px;
    z-index: 100;
    transition: left 0.28s;
    padding: 15px;

    .rows {
      margin-bottom: 5px;
    }
  }

  .list-common-bars {
    background-color: #f4f4f4;
    position: absolute;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    transition: left 0.28s;
  }

  /deep/.el-pagination {
    padding-top: 13px;
  }
}
</style>
