<template>
  <div class="searchForm">
    <el-form ref="queryForm" :model="form" :inline="true" label-width="70px">
       <el-form-item label="代理线">
        <el-input v-model="form.agent_group" placeholder="请输入代理线"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="form.url" placeholder="请输入域名" style="width: 250px;"></el-input>
      </el-form-item>

      <el-form-item label="域名类别">
        <el-select
          v-model="form.host_type"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in domainClassOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select
          v-model="form.status"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SearchForm",
  props: {},
  data() {
    return {
      form: {
        status: ""
      },
    };
  },

  computed: {
    statusOptions() {
      return [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' },
      ];
    },

    domainClassOptions() {
      return [
        { value: '推广域名', label: '推广域名' },
        { value: '跳转域名', label: '跳转域名' },
        { value: '主域名', label: '主域名' },
      ];
    },
  },

  watch: {
   },

  created() {},

  mounted() {},

  methods: {
    handleQuery() {
      const postData = {...this.form};

      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      this.form = { 
        status: ""
      };
      this.datetimeRange = [];
      this.$emit("resetQuery");
    }
  }
};
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
