<template>
  <div>
    <el-form :model="form" ref="queryForm" :inline="true" label-width="80px">
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="全部"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="可使用额度是否预警" label-width="150">
        <el-select
          v-model="form.notice"
          placeholder="全部"
          clearable
          size="small"
          style="width: 140px"
        >
          <el-option
            v-for="dict in warnTxt"
            :key="dict.label"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="币种">
        <el-select
          v-model="form.currency"
          placeholder="全部"
          clearable
          size="small"
          style="width: 140px"
        >
          <el-option
            v-for="dict in curOptions"
            :key="dict"
            :label="dict"
            :value="dict"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="银行名称">
        <el-input v-model="form.bank_title" />
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
  props: {
    warnTxt: {
      default: () => [],
      type: Array,
    },
    statusOptions: {
      default: () => [],
      type: Array,
    },
     curOptions: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      form: {
        status: '',
        notice: "",
        currency: "",
        bank_title: "",
        gcash: "",
      },
      bankList: [],
    };
  },
  created() {
    this.handleQuery();
  },
  methods: {

    handleQuery() {
      this.$emit("submit", this.form);
    },
    resetQuery() {
      this.form = {
         status: '',
        warn: "",
        currency: "",
        bank_title: ""
      };
      this.handleQuery()
    },
  },
};
</script>
