<template>
  <div class="searchForm">
    <el-form ref="queryForm" :model="form" :inline="true" label-width="70px">
      <!-- <el-form-item label="代理线">
        <el-input v-model="form.agent_group" placeholder="请输入代理线"></el-input>
      </el-form-item> -->
      <el-form-item label="域名">
        <el-input v-model="form.url" placeholder="请输入域名" style="width: 250px;"></el-input>
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
        <div class="el-input-group">
          <div class="el-input-group__prepend">
            <el-select v-model="dateType" style="width: 110px">
              <el-option
                v-for="(opt, index) in dateTypeOptions"
                :key="index"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
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
        </div>
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
      dateType: 'created_at', 
      datetimeRange: [],

      form: {
        url: "",
      },
    };
  },

  computed: {
     statusOptions() {
      return [
        { value: 1, label: '已解决' },
        { value: 2, label: '待处理' },
      ];
    },

    dateTypeOptions() {
      return [
        { value: 'created_at', label: '回报时间' },
        { value: 'fix_at', label: '处理时间' },
      ];
    },
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {

    handleQuery() {
      const postData = {...this.form};
      
     if (this.datetimeRange) {
        postData.time_type = this.dateType;
        postData.start_at = this.datetimeRange[0];
        postData.end_at = this.datetimeRange[1];
      }
      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      this.kwType = 1;
      this.form = { 
        url: "",
      };
      this.datetimeRange = [];
      this.dateType == 'created_at'
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
