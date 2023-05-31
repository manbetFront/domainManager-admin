<template>
  <div>
    <el-dialog title="修改订单金额" :visible.sync="dialogFormVisible" width="55%">
      <el-form :model="form" :label-width="formLabelWidth" label-suffix=":">

        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="form.order_id" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种">
              <el-input v-model="form.coin_type" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- two -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员账号">
              <el-input v-model="form.username" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="存款人地址">
              <el-input v-model="form.withdraw_from" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- three  有汇率-->
        <el-row v-show="ifRate">
          <el-col :span="12">
            <el-form-item label="申请金额">
              <el-input v-model="form.apply_num" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="汇率">
              <el-input v-model="form.rate" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- four   有汇率 -->
        <el-row v-show="ifRate">
          <el-col :span="12">
            <el-form-item label="应充值金额">
              <el-input v-model="form.rate_num" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 有汇率 -->
            <el-form-item label="实际充值金额 ">
              <el-input v-model="form.real_num" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- five 有汇率  字段待定-->
        <el-row v-show="ifRate">
          <el-col :span="13">
            <el-form-item label="新的修改申请金额" label-width="130px">
              <el-input v-model="form.newApplyMoney" autocomplete="off" disabled />
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 下面根据状态来显示 -->

        <!-- 无汇率订单修改金额 ===================-->

        <!-- six  无汇率-->
        <el-row v-show="!ifRate">
          <el-col :span="12">
            <el-form-item label="申请金额">
              <el-input v-model="form.apply_num" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 无汇率 -->
            <el-form-item label="充值金额">
              <el-input v-model="form.real_num" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- seven  无汇率-->
        <el-row v-show="!ifRate">
          <el-col :span="12">
            <el-form-item label="修改申请金额">
              <el-input v-model="form.after_apply_num" autocomplete="off" />
            </el-form-item>
          </el-col>

        </el-row>
        <!-- end============== -->
        <el-form-item label="备注">
          <el-input v-model="form.remark" autocomplete="off" type="textarea" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePass()">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changeOrderMoney, changeOrderMoneyWithNoRate } from '@/api/theme/order/rate'
export default {
  name: 'EditDialog',
  components: {},
  props: {},
  data () {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: false,
      form: {},
      ifRate: true
    }
  },

  computed: {},

  watch: {},

  created () { },

  mounted () {

  },

  methods: {
    open (rowData) {
      this.form = { ...rowData }
      let newApplyMoney = rowData.real_num * rowData.rate
      this.form.newApplyMoney = this.getFloat(newApplyMoney,0)
      this.dialogFormVisible = true
      if (rowData.rate === 0) {
        this.ifRate = false
      } else {
        this.ifRate = true
      }
    },
    //数组取0方法
    getFloat (number, n) {
      n = n ? parseInt(n) : 0;
      if (n <= 0) {
        return Math.round(number);
      }
      number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
      number = Number(number).toFixed(n); //补足位数
      return number;
    },
    // 有汇率修改
    handlePass () {
      if (!this.ifRate) {
        return this.getNoPass()
      }
      changeOrderMoney({
        id: this.form.id,
        remark: this.form.remark
      }).then(res => {
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        this.$parent.getList()
        this.$message.success('修改成功')
        this.dialogFormVisible = false
      })
    },
    // 无汇率修改
    async getNoPass () {
      const res = await changeOrderMoneyWithNoRate({
        id: this.form.id,
        remark: this.form.remark,
        after_apply_num: this.form.after_apply_num
      })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$parent.getList()
      this.$message.success('修改成功')
      this.dialogFormVisible = false
    }
  }

}

</script>
<style lang='scss' scoped>
</style>
