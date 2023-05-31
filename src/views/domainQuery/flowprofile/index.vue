<template>
  <div class="walletStyle">
    <FilterForm @submit="handleQuery" />
    <div class="tableStyle">
      <el-row class="rowStyle">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(0)"
        >
          新增
        </el-button>
      </el-row>
      <el-table v-loading="loading" :data="configList" border :max-height="650">
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column
          label="充值币种"
          align="center"
          prop="deposit_coin_type"
        />
        <el-table-column
          label="兑换币种"
          align="center"
          prop="change_coin_type"
        />
        <el-table-column
          label="允许实时汇率区间"
          align="center"
          prop="currency"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.min_range + "-" + scope.row.max_range }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手动默认汇率"
          align="center"
          prop="default_num"
        />
        <el-table-column label="实时汇率" align="center" prop="time_rate">
          <!-- <template slot-scope="scope">
          <span>{{ $toThousands(scope.row.notice_amount) }}</span>
        </template> -->
        </el-table-column>
        <el-table-column label="模式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_type == 1 ? "手动" : "自动" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? "上架" : "下架" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['system:config:edit']"
              size="mini"
              @click="handleUpdateStatus(scope.row)"
              >{{ scope.row.status === 2 ? "上架" : "下架" }}</el-button
            >
            <el-button
              v-hasPermi="['system:config:edit']"
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
              >编辑
            </el-button>
            <el-button
              v-hasPermi="['system:config:edit']"
              type="danger"
              size="mini"
              @click="handleDel(scope.row)"
              >删除
            </el-button>
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
    <!-- 添加或修改参数配置对话框 -->
    <create-form ref="createForm" />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { rateList, rateHighLow, rateDelete } from "@/api/theme/order/rate";
import CreateForm from "./components/CreateForm.vue";
import FilterForm from "./components/FilterForm.vue";

export default {
  components: {
    FilterForm,
    Pagination,
    CreateForm
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 防止重复提交
      // title
      title: "",
      // 总条数
      total: 0,
      // 表格数据
      configList: [],

      // 查询参数
      listQuery: {
        page: 1,
        page_size: 10
      }
    };
  },
  created() {
    this.getList();
  },

  methods: {
    // 搜索
    handleQuery(param) {
      this.listQuery = Object.assign(this.listQuery, param);
      this.getList();
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      rateList({ ...this.listQuery })
        .then(response => {
          if (response.status === 200) {
            const data = response.data || [];

            this.configList = data.data;
            this.total = data.total;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    handleAdd(row) {
      this.$refs.createForm.open(row);
    },
    handleDel({ id }) {
      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rateDelete({ id })
            .then(res => {
              if (res.status !== 200) {
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("删除成功");
              this.getList();
              this.$store.dispatch("order/getNumber1");
            })
            .catch();
        })
        .catch();
    },

    handleUpdateStatus(row) {
      rateHighLow({
        id: row.id,
        status: row.status === 1 ? 2 : 1
      })
        .then(res => {
          this.getList();
          if (res.status !== 200) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("操作成功");
          this.getList();
        })
        .catch();
    }
  }
};
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
    margin-bottom: 30px;

    .rowStyle {
      text-align: right;
      margin-bottom: 20px;
    }
  }
  .el-table .cell {
    padding: 0 !important;
  }

  .el-button--mini {
    padding: 7px 10px;
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
