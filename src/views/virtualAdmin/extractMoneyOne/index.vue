<template>
  <div class="walletStyle">

    <!-- 表格 -->
    <div class="tableStyle">
      <el-table v-loading="loading" :data="tableData" stripe border :max-height="650">
        <el-table-column prop="order_id" label="订单号" width="180" align="center" />
        <el-table-column prop="coin_type" label="币种" width="180" align="center" />
        <el-table-column prop="net_type" label="协议" width="220" align="center" />
        <el-table-column prop="extract_address" label="提取钱包地址" width="220" align="center" />
        <el-table-column prop="to_address" label="转入钱包地址" width="180" align="center" />
        <el-table-column prop="amount" label="提取全额" width="180" align="center" />
        <el-table-column prop="first_name" label="操作账号" width="180" align="center" />
        <el-table-column prop="apply_time" label="申请时间" width="180" align="center" />
        <el-table-column prop="remark" label="备注" width="180" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="carryMoney(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
    <!-- 审核 -->
    <carry-dialog ref="carryDialog" />
  </div>
</template>

<script>
import { getWithdrawList } from '@/api/theme/order/rate'
import Pagination from '@/components/Pagination'
import CarryDialog from './components/carryDialog'
export default {
  // name: 'ExtractMoneyOne',
  components: {
    Pagination,
    CarryDialog
  },
  props: {},
  data() {
    return {
      total: 0,
      loading: false,
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
    async getList() {
      this.loading = true
      const res = await getWithdrawList(this.listQuery)
      if (res.status !== 200) {
        this.loading = false
        return this.$message.error(res.msg)
      }
      this.loading = false
      this.tableData = res.data.data
      this.total = res.data.total
    },

    // 审核
    carryMoney(rowData) {
      this.$refs.carryDialog.open(rowData)
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
