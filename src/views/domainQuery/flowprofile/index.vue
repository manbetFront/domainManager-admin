<template>
  <div class="app-container">
    <div class="list-common-query">
      <FilterForm @submit="handleQuery" />
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
      <el-table v-loading="loading" :data="configList" border :max-height="650">
        <el-table-column label="代理线" align="center" prop="agent_group" />
        <el-table-column
          label="推广域名"
          align="center"
          prop="agent_host"
        />
        <el-table-column
          label="域名备注"
          align="center"
          prop="agent_remark"
        />
        <el-table-column label="日访问量" align="center" prop="uv" />
        <el-table-column label="日注册量" align="center" prop="register_num" />
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="list-common-bars">
      <div class="lr">
        <div class="rows">
          访问量总计: {{ total_uv }}
        </div>
        <div class="rows">
          注册量总计: {{ total_register }}
        </div>
      </div>
      <pagination
       class="fr"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { list } from "@/api/theme/domain/flow";
import FilterForm from "./components/FilterForm.vue";
import { getSiteData } from "@/utils/auth";
import { uniqueArr } from '@/utils/index'
export default {
  components: {
    FilterForm,
    Pagination
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      configList: [],

      // 查询参数
      listQuery: {
        page: 1,
        size: 10
      },

      total_uv: 0,
      total_register: 0,
      tabActive: "",
    };
  },

  computed: {
    sites(){
      return uniqueArr(getSiteData().split(','));
    }
  },

  mounted() {
    this.tabActive = this.sites[0];
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
      list({ ...this.listQuery })
        .then(response => {
          if (response.code === 200) {
            const data = response.data || [];
            this.total_uv = data.total_uv;
            this.total_register = data.total_register_num;
            this.configList = data.list.data;
            this.total = data.list.total;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
