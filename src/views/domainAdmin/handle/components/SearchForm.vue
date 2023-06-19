<template>
  <div class="searchForm">
    <el-form ref="queryForm" :model="form" :inline="true" label-width="70px">
      <el-form-item label="代理线">
        <el-input v-model="form.agent_group" placeholder="请输入代理线"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="form.url" placeholder="请输入域名" style="width: 250px;"></el-input>
      </el-form-item>

      <el-form-item label="操作时间">
          <el-date-picker
            v-model="datetimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
          />
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
      dateType: 1, 
      datetimeRange: [],

      form: {
        agent_group: "",
        url: "",
      },
    };
  },

  computed: {
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {

    handleQuery() {
      const postData = {...this.form};
      
      if (this.datetimeRange) {
          postData.start_at = this.datetimeRange[0];
          postData.end_at = this.datetimeRange[1];
      }

      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      this.kwType = 1;
      this.form = { 
        agent_group: "",
        url: "",
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
