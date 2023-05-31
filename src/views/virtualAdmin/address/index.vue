<template>
  <div class="walletStyle">
    <!-- 搜索框 -->
    <search-form @submit="handleQuery" @resetQuery="resetQuery" />
    <!-- 分割线 -->
    <!-- <el-divider /> -->
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table v-loading="loading" :data="configList" stripe border :max-height="650">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="use_order_no" label="订单号" align="center" />
        <el-table-column prop="coin_type" label="币种" align="center" />
        <el-table-column prop="net_type" label="协议" width="220" align="center" />
        <el-table-column prop="wallet_address" label="钱包地址" align="center" />
        <el-table-column prop="use_username" label="使用中的用户" width="200" align="center" />
        <el-table-column prop="apply_num" label="申请金额" width="200" align="center" />
        <el-table-column prop="rate_change_num" label="汇率充值金额" width="200" align="center" />
      </el-table>
    </div>
    <!-- 底下固定栏 -->
    <div class="page-fixed-static">
      <div class="rows">
        总计有{{ addressText }}个地址冻结中
      </div>

    </div>
    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import { useWalletAddressList } from '@/api/theme/order/rate'
import Pagination from '@/components/Pagination'
import SearchForm from './components/SearchForm'

export default {
  // name: 'Wallet',
  components: {
    SearchForm,
    Pagination

  },
  props: {},
  data() {
    return {
      total: 0,
      loading: false,
      // 查询参数
      listQuery: {
        page: 1,
        page_size: 10
      },
      addressText: '',
      // 使用中的钱包
      userWalletList: {},
      // 钱包综合的数据
      configList: []
    }
  },

  computed: {},

  watch: {},

  created() { },

  mounted() {
    this.getList()
  },

  methods: {
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10
      }
      this.getList()
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10
      }
      this.listQuery = Object.assign(this.listQuery, param)
      this.getList()
    },
    // 使用中的钱包
    getList() {
      this.loading = true
      useWalletAddressList({ ...this.listQuery }).then(response => {
        if (response.status === 200) {
          const data = response.data || []

          this.configList = data.data
          this.addressText = response.frozen_account
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
  // min-height: calc(100vh - 84px);
  padding-top: 20px;
  // position: relative;

  .tableStyle {
    padding: 0 25px;
    // height: calc(100vh - 320px);
    // overflow-y: auto;
     margin-bottom: 150px;

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
