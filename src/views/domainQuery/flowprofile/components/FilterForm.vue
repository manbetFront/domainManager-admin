<template>
  <div>
    <el-form ref="queryForm" :model="form" :inline="true" label-width="80px">
      <el-form-item label="域名搜索">
        <el-input
          v-model="form.name"
          placeholder="请输入域名或代理线"
        ></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker v-model="value1" type="date" placeholder="选择日期">
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
        status: ""
      },
      bankList: [],
      statusOptions: [
        {
          label: "上架",
          value: "1"
        },
        {
          label: "下架",
          value: "2"
        }
      ]
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
        status: ""
      };
      this.handleQuery();
    }
  }
};
</script>
