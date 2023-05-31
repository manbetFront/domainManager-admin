<template>
  <div class="searchForm">
    <el-form
      ref="queryForm"
      :model="form"
      :inline="true"
      label-width="40px"
    >
      <el-form-item label="币种">
        <el-select
          v-model="form.coin_type"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        <el-input
          v-model="form.valueText"
          clearable
        >
          <el-select
            slot="prepend"
            v-model="form.typeWay"
            style="width: 115px"
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
      typeOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'USDT',
          label: 'USDT'
        },
        {
          value: 'BTC',
          label: 'BTC'
        },
        {
          value: 'ETH',
          label: 'ETH'
        }
      ],
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '未到账'
        },
        {
          value: '2',
          label: '已到账'
        },
        {
          value: '3',
          label: '未匹配'
        },
        {
          value: '4',
          label: '成功'
        },
        {
          value: '5',
          label: '成功,改过金额'
        },
        {
          value: '6',
          label: '超时'
        },
        {
          value: '7',
          label: '失败'
        }
      ],
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
      postData.status = this.form.status
      postData.coin_type = this.form.coin_type
      this.$emit('submit', postData)
    },
    // 重置
    resetQuery() {
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
