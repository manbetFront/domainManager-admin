<template>
  <div class="walletStyle">
    <!-- 搜索框 -->
    <!-- <search-form
      @submit="handleQuery"
      @resetQuery="resetQuery"
      @handleExport="handleExport"
    /> -->
    <!-- 表格 -->
    <div class="tableStyle">
      <el-table
        v-loading="loading"
        :data="configList"
        stripe
        border
        :max-height="650"
      >
        <el-table-column prop="id" label="警报时间" align="center" />
        <el-table-column prop="coin_type" label="代理线" align="center" />
        <el-table-column prop="net_type" label="域名地址" align="center" />
        <el-table-column
          prop="wallet_address"
          label="域名备注"
          width="220"
          align="center"
        />
        <el-table-column prop="balance" label="警报原因" align="center" />

        <el-table-column label="状态" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? "上架" : "下架" }}</span>
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
    <!-- <edit-dialog ref="editDialog" /> -->
    <!-- 提现 -->
    <!-- <carry-dialog ref="carryDialog" /> -->
  </div>
</template>

<script>
import {
  walletAddressListDownload,
  moneyList,
  updateWalletAddress,
  deleteWalletAddress
} from "@/api/theme/order/rate";
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import EditDialog from "./components/editDialog";
import CarryDialog from "./components/carryDialog";
import { getRole, getSiteData } from "@/utils/auth";
export default {
  // name: 'Wallet',
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
      loading: false,
      // 查询参数
      listQuery: {
        page: 1,
        page_size: 10
      },
      exportData: {},
      // 使用中的钱包
      userWalletList: {},
      // 钱包综合的数据
      walletData: {},
      configList: []
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getList();
  },

  methods: {
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        page_size: 10
      };
      this.exportData = {};
      this.getList();
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        page_size: 10
      };
      this.exportData = param;
      this.listQuery = Object.assign(this.listQuery, param);
      this.getList();
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      moneyList({ ...this.listQuery })
        .then(res => {
          if (res.status === 200) {
            this.configList = res.data.data;
            this.total = res.data.total;
            this.walletData.balance_total = res.balance_total;
            this.walletData.trc_total = res.trc_total;
            this.walletData.erc_total = res.erc_total;
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
    // 提现
    carryMoney(rowData) {
      if (rowData.status === 1) {
        return this.$message.error("请先完成下架");
      }
      this.$refs.carryDialog.open(rowData);
    },
    // 上下架
    handleUpdateStatus(row) {
      updateWalletAddress({
        id: row.id,
        status: row.status === 1 ? 2 : 1
      }).then(res => {
        this.getList();
        if (res.status !== 200) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("操作成功");
        this.getList();
      });
    },
    // 删除了
    handleDel({ id }) {
      this.$confirm("确认删除, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteWalletAddress({ id }).then(res => {
            if (res.status !== 200) {
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("刪除成功");
            this.$store.dispatch("order/getNumber2");
            this.getList();
          });
        })
        .catch(() => {});
    },
    //导出
    handleExport() {
      const param = {
        ...this.exportData,
        // group: getRole(),
        platform: getSiteData(),
        export: 1
      };
      console.log(walletAddressListDownload(param));
      window.open(walletAddressListDownload(param));
    }
  }
};
</script>
<style lang="scss" scoped>
.walletStyle {
  // height: 100%;
  // min-height: calc(100vh - 84px);
  padding-top: 20px;

  .tableStyle {
    padding: 0 25px;
    // height: calc(100vh - 320px);
    // overflow-y: auto;
    margin-bottom: 180px;

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
