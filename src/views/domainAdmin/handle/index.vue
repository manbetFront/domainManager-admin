<template>
  <div class="walletStyle">
    <!-- 搜索框 -->
    <search-form
      @handleExport="handleExport"
      @submit="handleQuery"
      @resetQuery="resetQuery"
    />
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        :max-height="650"
      >
        <!-- <el-table-column label="序号" width="80" type="index" align="center" /> -->
        <el-table-column
          prop="order_id"
          label="操作时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="username"
          label="代理线"
          width="220"
          align="center"
        />
        <el-table-column
          prop="apply_num"
          label="操作域名"
          width="220"
          align="center"
        />
        <el-table-column
          prop="after_apply_num"
          label="域名备注"
          width="220"
          align="center"
        />
        <el-table-column
          prop="apply_coin_type"
          label="操作内容"
          width="180"
          align="center"
        />
        <el-table-column
          fixed="right"
          prop="rate_num"
          label="操作人"
          width="180"
          align="center"
        />
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
  </div>
</template>

<script>
// orderList
import {
  orderListIsChangeMoneyDownload,
  payChangeRecord
} from "@/api/theme/order/rate";
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import { getRole, getSiteData } from "@/utils/auth";
export default {
  // name: 'PayMoneyRecord',
  components: {
    SearchForm,
    Pagination
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0,
      exportData: {},
      listQuery: {
        page: 1,
        page_size: 10,
        if_change_num: 2
      },
      tableData: []
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    // 表格列表
    this.getList();
  },

  methods: {
    //导出
    handleExport() {
      const param = {
        ...this.exportData,
        // group: getRole(),
        platform: getSiteData(),
        if_change_num: 2,
        export: 1
      };
      console.log(orderListIsChangeMoneyDownload(param), "变更记录==");
      window.open(orderListIsChangeMoneyDownload(param));
    },
    // 跳转链接
    toUrl(url) {
      window.open(url);
    },
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10,
        if_change_num: 2
      };
      (this.exportData = {}), this.getList();
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10,
        if_change_num: 2
      };
      (this.exportData = param),
        (this.listQuery = Object.assign(this.listQuery, param));
      this.getList();
    },
    // 查询列表
    getList() {
      this.loading = true;
      payChangeRecord({ ...this.listQuery })
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
    }
  }
};
</script>
<style lang="scss" scoped>
.walletStyle {
  // height: 100%;
  min-height: calc(100vh - 84px);
  padding: 25px;
  // position: relative;

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
