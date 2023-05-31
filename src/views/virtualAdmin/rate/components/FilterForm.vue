<template>
  <div>
    <el-form ref="queryForm" :model="form" :inline="true" label-width="80px">
      <el-form-item label="状态">
        <el-select
          v-model="form.status"
          placeholder="全部"
          clearable
          size="mini"
          style="width: 180px"
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
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
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
        status: ''
      },
      bankList: [],
      statusOptions: [
        {
          label: '上架',
          value: '1'
        },
        {
          label: '下架',
          value: '2'
        }
      ]
    }
  },
  created() {
    // this.handleQuery()
  },
  methods: {

    handleQuery() {
      this.$emit('submit', this.form)
    },
    resetQuery() {
      this.form = {
        status: ''
      }
      this.handleQuery()
    }
  }
}
</script>
