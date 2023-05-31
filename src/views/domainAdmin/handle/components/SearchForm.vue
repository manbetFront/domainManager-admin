<template>
  <div class="searchForm">
    <el-form
      ref="queryForm"
      :model="form"
      :inline="true"
    >

      <el-form-item>
        <el-input
          v-model="form.valueText"
          clearable
        >
          <el-select
            slot="prepend"
            v-model="form.typeWay"
            style="width: 125px"
            clearable
            placeholder="全部"
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

      <el-form-item style="margin-left:20px">
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
        valueText: ''
      },

      kwOptions: [
        {
          label: '会员账号',
          value: 'username'
        },
        {
          label: '订单号',
          value: 'order_id'
        },
        {
          label: '区域链订单号',
          value: 'trade_no'
        },
        {
          label: '申请金额',
          value: 'apply_num'
        },
        {
          label: '汇率充值金额',
          value: 'rate_num'
        },
        {
          label: '实际充值金额',
          value: 'real_num'
        },
        {
          label: '收款地址',
          value: 'withdraw_address'
        },
        {
          label: '存款人地址',
          value: 'withdraw_from'
        }
      ]
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    // 选择框发生改变
    getTextValue() {
      this.form.valueText = ''
    },
    handleQuery() {
      const postData = {}
      postData[this.form.typeWay] = this.form.valueText
      // postData.status = this.form.status
      // postData.coin_type = this.form.coin_type
      this.$emit('submit', postData)
    },
    // 重置
    resetQuery() {
      const obj = {
        valueText: ''
      }
      this.form = { ...obj }
      this.$emit('resetQuery')
    },
     //导出
     handleExport () {
      this.$emit('handleExport')
    }
  }
}
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
