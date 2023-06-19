<template>
  <div>
    <el-form ref="queryForm" :model="form" :inline="true" label-width="80px">
      <el-form-item label="代理线">
        <el-input v-model="form.agent_group" placeholder="请输入代理线"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="form.url" placeholder="请输入域名" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker v-model="form.info_date" type="date" 
          placeholder="选择日期"  format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
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
  props: {},
  data() {
    return {
      form: {
        agent_group: "",
        url: "",
        info_date: "",
      },
    };
  },
  created() {
    // this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.$emit("submit", this.form);
    },
    resetQuery() {
      this.form = {
        agent_group: "",
        url: "",
        info_date: "",
      };
      this.handleQuery();
    }
  }
};
</script>
