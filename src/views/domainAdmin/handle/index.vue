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
        <el-table-column
          prop="created_at"
          label="操作时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="agent_group"
          label="代理线"
          width="220"
          align="center"
        />
        <el-table-column
          prop="host"
          label="操作域名"
          width="220"
          align="center"
        />
        <el-table-column
          prop="host_remark"
          label="域名备注"
          width="220"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="操作内容"
          width="180"
          align="center"
        />
        <el-table-column
          fixed="right"
          prop="user_name"
          label="操作人"
          width="180"
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
// orderList
import {
  list,
} from "@/api/theme/domain/log";
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
      return Array(getSiteData());
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
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
