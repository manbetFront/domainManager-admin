<template>
  <div class="app-container">
    <div class="list-common-query">
       <search-form
        @submit="handleQuery" @resetQuery="resetQuery"
      />
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
        <!-- <el-table-column label="序号" width="80" type="index" align="center" /> -->
        <el-table-column prop="id" label="问题编号" width="80" align="center" />
        <el-table-column prop="agent_group" label="代理线" width="100" align="center" />
        <el-table-column prop="agent_host" label="域名" width="220" align="center" />
        <el-table-column prop="agent_remark" label="域名备注" width="220" align="center" />
        <el-table-column prop="created_at" label="回报时间" width="160" align="center" />
        <el-table-column prop="fix_at" label="处理时间" width="160" align="center" />
        <el-table-column prop="remark" label="问题描述" width="180" align="center" />
        <el-table-column prop="fix_remark" label="处理结果备注" width="180" align="center" />
        <el-table-column label="是否可控" align="center" width="100">
            <template slot-scope="{ row }">
              <span v-if="row.is_control === 1">可控域名</span>
              <span v-else>不可控域名</span>
            </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="90">
          <template slot-scope="{ row }">
            <span v-if="row.status === 1">已解决</span>
            <span v-else>待处理</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="fix_user"
          label="操作人"
          width="100"
          align="center"
        />
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="list-common-bars">
      <pagination
        class="fr"
        :total="total"
        :page.sync="listQuery.page"
        :size.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>

import {
  reportLog
} from "@/api/theme/alarm/index";
import Pagination from "@/components/Pagination";
import SearchForm from "./components/SearchForm";
import { getSiteData } from "@/utils/auth";
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
      listQuery: {
        page: 1,
        size: 10,
      },
      tableData: [],
      tabActive: "",
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
      reportLog({ ...this.listQuery })
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
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
