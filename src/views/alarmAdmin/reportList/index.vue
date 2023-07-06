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
        <el-table-column prop="id" label="问题编号" width="80" align="center" />
        <el-table-column prop="agent_group" label="代理线" align="center" />
        <el-table-column label="域名" align="center" width="150">
          <template slot-scope="{ row }">
           <a class="alink" @click="handleLink(row.agent_host)">{{ row.agent_host }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="agent_remark" label="域名备注" align="center" width="150"/>
       <el-table-column prop="host_type" label="域名类别" align="center" width="110">
          <!-- <template slot-scope="{ row }">
            <span>{{ domainClassText[row.domainclass]}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="created_at" label="回报时间" width="150" align="center" />
        <el-table-column prop="remark" label="问题描述" width="150" align="center" />
        <el-table-column label="是否可控" align="center" width="110">
          <template slot-scope="{ row }">
            <span v-if="row.is_control === 1">可控域名</span>
            <span v-else>不可控域名</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{ row }">
            <span v-if="row.host_status === 1">正常</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleReport(scope.row)"
              >处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination
        class="fr"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </div>
    <!-- 编辑 -->
    <edit-dialog :visible.sync="editDialog" ref="editDialog" />
</div>
</template>

<script>
import {
  reportList
} from "@/api/theme/alarm/index";
import { getSiteData } from '@/utils/auth'
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import EditDialog from "./components/editDialog";
export default {
  components: {
    SearchForm,
    Pagination,
    EditDialog,
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
    domainClassText() {
      return {
        1: '主域名',
        2: '跳转域名',
        3: '推广域名',
      };
    },

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
      reportList({ ...this.listQuery })
        .then(response => {
          if (response.code === 200) {
            const data = response.data || [];
            this.tableData = data.data;
            this.total = data.total;
            this.loading = false;
            this.$store.dispatch("order/refreshNumber3", this.total);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //回报
    handleReport(rowData){
      this.editDialog = true;
      this.$refs.editDialog.open(rowData, this.tabActive);
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
