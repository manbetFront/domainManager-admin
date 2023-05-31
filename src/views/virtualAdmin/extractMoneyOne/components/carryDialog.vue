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
        <el-form-item label="提取钱包地址">
          <el-input v-model="form.extract_address" disabled />
        </el-form-item>
        <el-form-item label="转入钱包地址">
          <el-input v-model="form.to_address" disabled />
        </el-form-item>
        <el-form-item label="提取全额">
          <el-input v-model="form.amount" disabled />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="handleOperate(2)"
        >拒绝</el-button>
        <el-button
          type="primary"
          @click="handleOperate(1)"
        >通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { examineWithdrawOrder } from '@/api/theme/order/rate'
import { getUser } from '@/utils/auth'
export default {
  name: 'CarryDialog',
  components: {},
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      postData: {
        first_name: getUser(),
        operation_user: getUser()
      }

    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    open(rowData) {
      this.dialogFormVisible = true
      this.form = { ...rowData }
      this.postData.id = rowData.id
      this.postData.first_name = rowData.first_name ? rowData.first_name : getUser()
      this.postData.operation_user = rowData.operation_user ? rowData.operation_user : getUser()
    },
    // 审核or 拒绝
    async handleOperate(type) {
      this.postData.examine_status = type
      // return
      const res = await examineWithdrawOrder(this.postData)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.dialogFormVisible = false
      this.$message.success('操作成功')
      this.$parent.getList()
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
