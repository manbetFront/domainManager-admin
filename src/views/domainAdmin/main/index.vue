<template>
 <div class="app-container">
    <div class="list-common-query">
       <search-form @submit="handleQuery" @resetQuery="resetQuery" />
    </div>

    <el-tabs v-model="tabActive" type="border-card" >
      <template v-for="(tab, index) in sites">
        <el-tab-pane
          :key="index"
          :name="tab"
          :label="tab"
        >
        </el-tab-pane>
      </template>
    </el-tabs>

    <div class="list-common-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        :max-height="650"
      >
        <!-- <el-table-column type="index" label="序号" width="80" align="center" /> -->
        <el-table-column prop="agent_group" label="代理线" align="center" />
        <el-table-column label="主域名" align="center" width="150">
          <template slot-scope="{ row }">
           <a class="alink" @click="handleLink(row.host)">{{ row.host }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="域名备注" align="center" min-width="150" />
        <!-- <el-table-column prop="ip" label="服务器IP" align="center" min-width="120" /> -->
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="180"
          align="center"
        />
        <el-table-column label="到期时间" width="150" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.near_expire === 1" style="color:#FF0000">{{ row.host_expire_at }}</span>
            <span v-else>{{ row.host_expire_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uv" label="总访问量" align="center" />
        <el-table-column prop="register_num" label="总注册量" align="center" />
        <el-table-column label="是否可控" align="center" width="110">
          <template slot-scope="{ row }">
            <span v-if="row.is_control === 1">可控域名</span>
            <span v-else>不可控域名</span>
          </template>
        </el-table-column>
        <el-table-column label="警报状态" align="center" fixed="right" width="100">
          <template slot-scope="{ row }">
            <span v-if="row.health === 1">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="status" label="状态" min-width="80" align="center">
            <template slot-scope="{ row }">
                <el-switch v-model="row.status" active-color="#13ce66"
                :active-value="1" :inactive-value="2" @change="onSwitch(row)" />
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="160" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.health === 1" type="text" size="small" @click="handleReport(row)"
              >回报</el-button
            >
            <el-button type="text" size="small" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="handleDel(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <div class="action-btn fl">
        <el-button type="primary" @click="openDialog()">
          新增域名
        </el-button>
      </div>

      <pagination
        class="fr"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <!-- 编辑 -->
    <edit-dialog :visible.sync="editDialog" ref="editDialog"/>
     <!-- 异常回报 -->
    <abnormal-report-dialog :visible.sync="reportDialog" ref="reportDialog" />
</div>
</template>

<script>
import {
  list,
  update,
  del
} from "@/api/theme/domain/main";
import { getSiteData } from '@/utils/auth'
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import EditDialog from "./components/editDialog";
import AbnormalReportDialog from "../../components/abnormalReportDialog";
export default {
  // name: 'VirtualOrder',
  components: {
    SearchForm,
    Pagination,
    EditDialog,
    AbnormalReportDialog
  },
  props: {},
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      loading: false,
      tableData: [],
      editDialog: false,
      tabActive: "",
      reportDialog: false,
    };
  },

  computed: {
    sites(){
      return getSiteData();
    }
  },

  watch: {},

  created() {},

  mounted() {
    this.tabActive = this.sites[0];
    this.resetQuery();
  },

  methods: {
    // 重置操作
    resetQuery() {
      this.listQuery = {
        page: 1,
        size: 10,
        platform: this.tabActive,
      };
      this.getList();
    },
    // 搜索
    handleQuery(param) {
      this.listQuery = {
        page: 1,
        size: 10,
        platform: this.tabActive,
      };
      this.listQuery = Object.assign(this.listQuery, param);
      this.getList();
    },
    // 查询列表
    getList() {
      this.loading = true;
      this.$store.dispatch("order/getNumber2");
      list({ ...this.listQuery })
        .then(response => {
          if (response.code === 200) {
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
      this.editDialog = true;
      this.$refs.editDialog.open(rowData, this.tabActive);
    },

    openDialog(){
      this.editDialog = true;
      this.$refs.editDialog.open(null, this.tabActive);
    },

    onSwitch(row) {
      update({
       ...row,
       status: Number(row.status),
       platform: this.tabActive,
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功');
          this.getList();
        } else {
          this.$message.error(res.msg);
          this.$set(row, 'status', Number(row.status) === 1 ? 2 :1);
        }
      })
    },

    handleDel(rowData){
      this.$confirm("确认删除该条数据么?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del({ id: rowData.id, platform: this.tabActive }).then(res => {
            if (res.code !== 200) {
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

     //回报
    handleReport(rowData){
      this.reportDialog = true;
      const params = {
        id: rowData.id,
        agent_group: rowData.agent_group,
        url: rowData.host,
        remark: "",
        host_type: "主域名",
      }
      this.$refs.reportDialog.open(params, this.tabActive);
    },

    handleLink(link) {
      if(link.indexOf('https') > -1){
        window.open(link);
      }else {
        window.open("https://www." + link);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.alink{
  color: #1890FF;
  cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
}
</style>
