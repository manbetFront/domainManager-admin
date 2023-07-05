<template>
  <div class="searchForm">
    <el-form ref="queryForm" :model="form" :inline="true" label-width="70px">
      <el-form-item>
        <el-input v-model="kwText" placeholder="请输入" clearable>
          <el-select v-model="kwType" slot="prepend" style="width: 105px">
            <el-option
              v-for="(opt, index) in kwOptions"
              :key="index"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-input>
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

      <el-form-item label="域名类别">
        <el-select
          v-model="form.is_control"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in domainTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="警报状况">
        <el-select
          v-model="form.health"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in alarmTypeOptions"
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
      kwType: "agent_group",
      kwText: "",

      dateType: 1, 
      datetimeRange: [],

      form: {
        status: ""
      },
    };
  },

  computed: {
    kwOptions() {
      return [
        {label: '代理线', value: "agent_group" },
        // { label: '代理code', value: "agent_code" },
        // { label: '推广域名', value: "agent_host" },
        { label: '跳转域名', value: "main_host_detail" },
        // { label: '主域名', value: "main_host" },
      ];
    },

    dateTypeOptions() {
      return [
        { value: 1, label: '创建时间' },
        { value: 2, label: '到期时间' },
      ];
    },

    statusOptions() {
      return [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' },
      ];
    },

    domainTypeOptions() {
      return [
        { value: 1, label: '可控域名' },
        { value: 2, label: '不可控域名' },
      ];
    },

    alarmTypeOptions() {
      return [
        { value: 1, label: '正常' },
        { value: 2, label: '异常' },
      ];
    },
  },

  watch: {
    kwType() {
      this.kwText = "";
    },
   },

  created() {},

  mounted() {},

  methods: {
    handleQuery() {
      const postData = {...this.form};
      postData[this.kwType] = this.kwText;
      if (this.datetimeRange) {
        if (this.dateType == 1) {
          postData.start_at = this.datetimeRange[0];
          postData.end_at = this.datetimeRange[1];
        } else {
          postData.start_host_expire_at = this.datetimeRange[0];
          postData.end_host_expire_at = this.datetimeRange[1];
        }
      }

      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      this.kwType = "agent_group";
      this.kwText = "";
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
