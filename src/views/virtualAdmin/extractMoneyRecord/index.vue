<template>
  <div class="walletStyle">
    <!-- 搜索框 -->
    <search-form @handleExport="handleExport" @submit="handleQuery" @resetQuery="resetQuery" />
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table v-loading="loading" :data="tableData" stripe border :max-height="650">
        <el-table-column prop="order_id" label="订单号" width="180" align="center" />
        <el-table-column label="区域链订单号" width="180" align="center">
          <template slot-scope="scope">
            <div style="text-decoration: underline;cursor:pointer;color:#328DFF" @click.self="toUrl(scope.row.transaction_info)">
              {{ scope.row.trade_no }}
            </div>
            <!-- {{ '点击地址跳转' }} -->
          </template>
        </el-table-column>
        <el-table-column prop="coin_type" label="币种" width="220" align="center" />
        <el-table-column prop="net_type" label="协议" width="220" align="center" />
        <el-table-column prop="extract_address" label="提取钱包地址" width="180" align="center" />
        <el-table-column prop="to_address" label="转入钱包地址" width="180" align="center" />
        <el-table-column prop="amount" label="提取全额" width="180" align="center" />
        <el-table-column prop="withdraw_fee" label="手续费" width="180" align="center" />
        <el-table-column prop="operation_user" label="操作账号" width="180" align="center" />
        <el-table-column prop="first_name" label="一审操作人" width="180" align="center" />
        <el-table-column prop="apply_time" label="申请时间" width="180" align="center" />
        <el-table-column prop="status" label="状态" width="180" align="center">
          <template slot-scope="{row}">
            {{ getStatus(row.status) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import {withdrawListAlreadyExamineDownload, withdrawListAlreadyExamine } from '@/api/theme/order/rate'
import Pagination from '@/components/Pagination'
import SearchForm from './components/SearchForm'
import { getRole,getSiteData } from '@/utils/auth'
export default {
  // name: 'ExtractMoneyRecord',
  components: {
    SearchForm,
    Pagination
  },
  props: {},
  data() {
    return {
      loading: false,
      exportData:{},
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10
      },
      tableData: []
    }
  },

  computed: {},

  watch: {},

  created() { },

  mounted() {
    this.getList()
  },

  methods: {
     //导出
     handleExport() {
      const param = {
        ...this.exportData,
        // group: getRole(),
        platform: getSiteData(),
        export: 1
      }
      console.log(withdrawListAlreadyExamineDownload(param))
      window.open(withdrawListAlreadyExamineDownload(param))
    },
     // 跳转链接
     toUrl(url) {
      window.open(url)
    },
    // 获取状态
    getStatus(num) {
      if (num === 1) {
        return '进行中'
      }
      if (num === 2) {
        return '成功'
      }
      if (num === 3) {
        return '失败'
      }
      if (num === 4) {
        return '超时'
      }
    },
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10
      }
      this.exportData = {}
      this.getList()
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10
      }
      this.exportData = param
      this.listQuery = Object.assign(this.listQuery, param)
      this.getList()
    },
    async getList() {
      this.loading = true
      const res = await withdrawListAlreadyExamine(this.listQuery)
      if (res.status !== 200) {
        this.loading = false
        return this.$message.error(res.msg)
      }
      this.loading = false
      this.tableData = res.data.data
      this.total = res.data.total
    }

  }

}
</script>
<style lang="scss" scoped>
.walletStyle {
  // height: 100%;
  // min-height: calc(100vh - 84px);
  padding-top: 20px;
  // position: relative;

  .tableStyle {
    padding: 0 25px;
    // height: calc(100vh - 320px);
    // overflow-y: auto;
    // margin-bottom: 30px;
    margin-bottom: 70px;

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
