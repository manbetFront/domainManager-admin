<template>
  <div class="walletStyle">

    <!-- 表格 -->
    <el-row class="rowStyle">
      <el-button type="primary" @click="handleEdit()">新增</el-button>
    </el-row>
    <div class="tableStyle">

      <el-table v-loading="loading" :data="tableData" stripe border :max-height="650">
        <el-table-column prop="id" label="ID" width="180" align="center" />
        <el-table-column prop="coin_type" label="币种" align="center" />
        <el-table-column prop="net_type" label="协议" align="center" />
        <el-table-column prop="address" label="白名单提现地址" align="center" />
        <el-table-column prop="effect_time" label="生效时间" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="date" label="状态" width="180" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.status === 1 ? '已启用' : scope.row.status === 2 ? '启用中' :'关闭' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="soldOut(scope.row)">{{ scope.row.status ===1 ?'关闭':scope.row.status ===2?'关闭':'启用' }}</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <!-- <div class="list-common-bars">
      <pagination :total="total" :page.sync="listQuery.page" :size.sync="listQuery.page_size" @pagination="getList" />
    </div> -->
    <!-- 编辑 -->
    <edit-dialog ref="editDialog" />

  </div>
</template>

<script>
import { deleteWithdrawAddress, updateWithdrawAddress } from '@/api/theme/order/rate'
// import Pagination from '@/components/Pagination'
import EditDialog from './components/editDialog'
export default {
  // name: 'ExtractMoneyAddress',
  components: {
    // Pagination,
    EditDialog
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
    handleDel({ id }) {
      this.$confirm('是否确认删除', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWithdrawAddress({ id })
          .then(res => {
            if (res.status !== 200) {
              this.$message.error(res.msg)
              return
            }
            this.$message.success('删除成功')
            this.getList()
          })
      }).catch()
    },
    async getList() {
      this.loading = true
      const res = await this.$store.dispatch('order/getWithdraw')
      if (res.status !== 200) {
        this.loading = false
        return this.$message.error(res.msg)
      }
      this.loading = false
      this.tableData = res.data
    },

    // 编辑
    handleEdit(rowData) {
      this.$refs.editDialog.open(rowData)
    },

    // 下架
    async soldOut (rowData) {
      let status = ''
      if (rowData.status==1 || rowData.status==2) {
        status=3
      } else {
        status=2
      }
      const res = await updateWithdrawAddress({
        remark: rowData.remark,
        id: rowData.id,
        status: status
      })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('操作成功')
      this.getList()
    }

  }
}
</script>
<style lang="scss" scoped>
.walletStyle {
  // height: 100%;
  // min-height: calc(100vh - 84px);
  padding-top: 20px;
  position: relative;

  .tableStyle {
    padding: 0 25px;
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

  .rowStyle {
    padding: 0 20px;
    margin-bottom: 20px;
  }

  /deep/.el-pagination {
    padding-top: 13px;
  }

}
</style>
