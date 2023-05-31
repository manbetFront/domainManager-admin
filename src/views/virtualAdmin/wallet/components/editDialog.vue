<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="form"
        :label-width="formLabelWidth"
      >
        <el-form-item
          label="备注"
        >
          <el-input
            v-model="form.remark"
            autocomplete="off"
            clearable
            type="textarea"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateWalletAddress } from '@/api/theme/order/rate'
export default {
  name: 'EditDialog',
  components: {},
  props: {},
  data() {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: false,
      form: {
        id: ''
      }
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {

  },

  methods: {
    open(rowData) {
      this.dialogFormVisible = true
      this.form = {}
      this.form.id = rowData.id
    },
    // 提交
    handleSubmit() {
      console.log('11231231')
      updateWalletAddress(
        this.form
      ).then(res => {
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return
        }
        this.$message.success('操作成功')
        this.dialogFormVisible = false
        this.$parent.getList()
      })
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
