<template>
  <div class="walletStyle">
    <!-- 搜索框 -->
    <search-form  @handleExport="handleExport" @submit="handleQuery" @resetQuery="resetQuery" />
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table v-loading="loading" :data="tableData" stripe border :max-height="650">
        <el-table-column label="序号" width="80" type="index" align="center" />
        <el-table-column prop="order_id" label="订单号" width="180" align="center" />
        <el-table-column label="区域链订单号" width="180" align="center">
          <template slot-scope="scope">
            <div style="text-decoration: underline;cursor:pointer;color:#328DFF" @click.self="toUrl(scope.row.transaction_info)">
              {{ scope.row.trade_no }}
            </div>
            <!-- {{ '点击地址跳转' }} -->
          </template>
        </el-table-column>
        <el-table-column prop="username" label="会员账号" width="220" align="center" />
        <el-table-column prop="apply_num" label="原申请金额" width="220" align="center" />
        <el-table-column prop="after_apply_num" label="变更后申请金额" width="220" align="center" />
        <el-table-column prop="apply_coin_type" label="申请币种" width="180" align="center" />
        <el-table-column prop="rate" label="汇率" width="180" align="center" />
        <el-table-column prop="rate_num" label="汇率充值金额" width="180" align="center" />
        <el-table-column prop="after_rate_num" label="修改后汇率充值金额" width="180" align="center" />
        <el-table-column prop="real_num" label="实际充值金额" width="180" align="center" />
        <el-table-column prop="coin_type" label="实际币种" width="180" align="center" />
        <el-table-column prop="created_at" label="订单提交时间" width="180" align="center" />
        <el-table-column prop="withdraw_from" label="存款人地址" width="180" align="center" />
        <!-- 字段待定 -->
        <!-- <el-table-column prop="apply_coin_type" label="收款方式" width="180" align="center" /> -->
        <!-- end=== -->
        <el-table-column prop="net_type" label="虚拟币协议" width="180" align="center" />
        <el-table-column prop="withdraw_address" label="收款地址" width="180" align="center" />

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
  // orderList
import {orderListIsChangeMoneyDownload,payChangeRecord } from '@/api/theme/order/rate'
import Pagination from '@/components/Pagination'
import SearchForm from './components/SearchForm'
import { getRole,getSiteData } from '@/utils/auth'
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
      exportData:{},
      listQuery: {
        page: 1,
        page_size: 10,
        if_change_num: 2

      },
      tableData: []
    }
  },

  computed: {},

  watch: {},

  created() { },

  mounted() {
    // 表格列表
    this.getList()
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
      }
      console.log(orderListIsChangeMoneyDownload(param),'变更记录==')
      window.open(orderListIsChangeMoneyDownload(param))
    },
    // 跳转链接
    toUrl(url) {
      window.open(url)
    },
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10,
        if_change_num: 2
      }
      this.exportData = {},
      this.getList()
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10,
        if_change_num: 2
      }
      this.exportData = param,
      this.listQuery = Object.assign(this.listQuery, param)
      this.getList()
    },
    // 查询列表
    getList() {
      this.loading = true
      payChangeRecord({ ...this.listQuery })
        .then(response => {
          if (response.status === 200) {
            const data = response.data || []
            this.tableData = data.data
            this.total = data.total
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
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
