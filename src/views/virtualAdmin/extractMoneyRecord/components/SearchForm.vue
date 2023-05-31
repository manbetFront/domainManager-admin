<template>
  <div class="searchForm">
    <el-form
      ref="queryForm"
      :model="form"
      :inline="true"
      label-width="80px"
    >
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
        <el-input
          v-model="form.valueText"
          clearable
        >
          <el-select
            slot="prepend"
            v-model="form.typeWay"
            style="width: 125px"
            @change="getTextValue"
          >
            <el-option
              v-for="(item, i) in kwOptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-input>
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
        <el-button
          type="primary"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  components: {},
  props: {},
  data() {
    return {
      form: {
        typeWay: '',
        valueText: ''
      },
      statusOptions: [
        {
          label: '进行中',
          value: '1'
        },
        {
          label: '成功',
          value: '2'
        },
        {
          label: '失败',
          value: '3'
        },
        {
          label: '超时',
          value: '4'
        }
      ],
      kwOptions: [
        {
          label: '币种',
          value: 'coin_type'
        },
        {
          label: '提取钱包地址',
          value: 'extract_address'
        },
        {
          label: '转入钱包地址',
          value: 'to_address'
        }
      ]
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
     //导出
     handleExport () {
      this.$emit('handleExport')
    },
    handleQuery() {
      // 新增===========
      const postData = {}
      postData[this.form.typeWay] = this.form.valueText
      postData.status = this.form.status
      // end =========
      this.$emit('submit', postData)
    },
    // 选择框发生改变
    getTextValue() {
      this.form.valueText = ''
    },
    // 重置
    resetQuery() {
      this.form = {}
      const obj = {
        valueText: ''
      }
      this.form = { ...obj }
      this.$emit('resetQuery')
    }
  }
}
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
