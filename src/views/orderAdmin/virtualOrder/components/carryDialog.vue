<template>
  <div>
    <el-dialog
      title="审核"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="form"
        :label-width="formLabelWidth"
      >
        <el-form-item label="订单号">
          <el-input
            v-model="form.order_id"
            disabled
          />
        </el-form-item>
        <el-form-item label="币种">
          <el-input
            v-model="form.coin_type"
            disabled
          />
        </el-form-item>
        <el-form-item label="会员账号">
          <el-input
            v-model="form.username"
            disabled
          />
        </el-form-item>
        <el-form-item label="存款人地址">
          <el-input
            v-model="form.withdraw_from"
            disabled
          />
        </el-form-item>
        <el-form-item label="应充值金额">
          <el-input
            v-model="form.rate_num"
            disabled
          />
        </el-form-item>
        <el-form-item label="充值金额">
          <el-input
            v-model="form.real_num"
            disabled
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="handleRefuse"
        >拒绝</el-button>
        <el-button
          type="primary"
          @click="handlePass"
        >通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// saveCoinCheck
import { saveCoinCheck } from '@/api/theme/order/rate'
export default {
  name: 'CarryDialog',
  components: {},
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px'

    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    open(rowData) {
      this.form = { ...rowData }
      this.dialogFormVisible = true
    },
    // 拒绝
    async handleRefuse() {
      try {
        await this.$confirm('您已确定拒绝此订单', {
          title: '确认拒绝',
          type: 'warning'
        })
        const { status, msg } = await saveCoinCheck({
          id: this.form.id,
          remark: this.form.remark,
          status: 7
        })
        if (status !== 200) {
          this.$message.error(msg)
          return
        }
        this.$message.success('已拒绝')
        this.dialogFormVisible = false
        this.$parent.getList()
        return
      } catch (error) {
        // return this.$message('已取消')
        console.log(error)
      }
    },
    // 通过
    async handlePass() {
      try {
        await this.$confirm('您已确定通过此订单', {
          title: '确定通过',
          type: 'warning'
        })
        const { status, msg } = await saveCoinCheck({
          id: this.form.id,
          remark: this.form.remark,
          status: 4
        })
        if (status !== 200) {
          this.$message.error(msg)
          return
        }
        this.$message.success('已通过')
        this.dialogFormVisible = false
        this.$parent.getList()
        return
      } catch (error) {
        console.log(error)
        // return this.$message('已取消')
      }
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
