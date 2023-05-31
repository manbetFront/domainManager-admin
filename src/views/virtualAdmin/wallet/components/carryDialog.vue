<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="rulesForm" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="转出地址" prop="wallet_address">
          <el-input v-model="form.wallet_address" placeholder="输入转出地址" disabled />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" placeholder="输入余额" disabled />
        </el-form-item>

        <el-form-item label="转入地址" prop="to_address">
          <el-select v-model="form.to_address" placeholder="请选择" clearable>
            <el-option v-for="item in options" :key="item.id" :label="item.address" :value="item.address" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="form.amount" placeholder="输入提现金额" clearable />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="输入备注" type="textarea" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { withdrawAddressList, createWithdrawOrder } from '@/api/theme/order/rate'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateForm',
  components: {},
  props: {},
  data () {
    return {
      dialogFormVisible: false,
      title: '提现',
      // 表单
      form: {
        user_type: 2,
        status: 1
      },
      ifAdd: true,
      options: [],
      rules: {
        wallet_address: [
          { required: true, trigger: 'blur', message: '输入转出地址' }
        ],

        balance: [
          { required: true, trigger: 'blur', message: '输入余额' }
        ],
        to_address: [
          { required: true, trigger: 'blur', message: '请选择转入地址' }
        ],
        amount: [
          { required: true, trigger: 'blur', message: '请输入提现金额' }
        ]

      }
    }
  },

  computed: {
    ...mapGetters(['whiteData'])
  },

  watch: {},

  created () { },

  mounted () {
    // if (this.whiteData.length) {
    //   this.options = this.whiteData
    // } else {
    //   this.$store.dispatch('order/getWithdraw').then(res => {
    //     if (res.status !== 200) {
    //       return this.$message.error(res.msg)
    //     }
    //     this.options = res.data
    //   })
    // }
  },

  methods: {

    open (rowData) {
      this.form = {}
      this.form = { ...rowData }
      this.dialogFormVisible = true
      this.getOption(rowData.net_type)
    },

    // 获取删选过后的转入地址
    getOption (net_type) {
      withdrawAddressList({ net_type,status:1 }).then(res => {
        if (res.status === 200) {
          this.options = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          let statueText = ''
          this.options.map(item => {
            if (item.address === this.form.to_address) {
              statueText = item.status
              return
            }
          })
          if (statueText === 2) {
            return this.$message.error('该转入地址未启用')
          }

          createWithdrawOrder({
            extract_address: this.form.wallet_address,
            to_address: this.form.to_address,
            net_type: this.form.net_type,
            amount: this.form.amount,
            coin_type: this.form.coin_type,
            remark: this.form.remark
          }).then(res => {
            if (res.status === 200) {
              this.$parent.getList()
              this.$message.success('提单成功')
              this.dialogFormVisible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}

</script>
<style lang='scss' scoped>
</style>
