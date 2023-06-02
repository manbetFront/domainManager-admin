<template>
  <div class="searchForm">
    <el-form ref="queryForm" :model="form" :inline="true">
      <el-form-item label="域名搜索">
        <el-input
          v-model="form.name"
          placeholder="请输入域名或代理线"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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

      <el-form-item style="margin-left:20px">
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
        <!-- <el-button type="primary" size="mini" @click="handleExport"
          >导出</el-button
        > -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SearchForm",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        status: ""
      },
      statusOptions: [
        {
          value: "1",
          label: "成功,启用"
        },
        {
          value: "0",
          label: "关闭"
        }
      ]
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    // 选择框发生改变
    getTextValue() {
      this.form.valueText = "";
    },
    handleQuery() {
      const postData = {};
      postData[this.form.typeWay] = this.form.valueText;
      // postData.status = this.form.status
      // postData.coin_type = this.form.coin_type
      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      const obj = {
        valueText: ""
      };
      this.form = { ...obj };
      this.$emit("resetQuery");
    },
    //导出
    handleExport() {
      this.$emit("handleExport");
    }
  }
};
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
