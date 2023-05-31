<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="rulesForm"
        :model="form"
        :label-width="formLabelWidth"
        :rules="rules"
      >
      <el-form-item label="币种"  prop="coin_type">
        <el-select
          v-model="form.coin_type"
          placeholder="请选择币种"
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
        <el-form-item
          label="白名单提现地址"
          prop="address"
        >
          <el-input
            v-model="form.address"
            autocomplete="off"
            :disabled="ifEdit"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            autocomplete="off"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          v-show="!ifEdit"
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="form.status">
            <el-radio :label="2">启用</el-radio>
            <el-radio :label="3">关闭</el-radio>
          </el-radio-group>
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
import { addWithdrewAddress, updateWithdrawAddress } from '@/api/theme/order/rate'
export default {
  name: 'EditDialog',
  components: {},
  props: {},
  data() {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: false,
      ifEdit: false,
      title: '新增',
      form: {},
      typeOptions: [
        {
          value: 'USDT',
          label: 'USDT'
        },
        // {
        //   value: 'BTC',
        //   label: 'BTC'
        // },
        // {
        //   value: 'ETH',
        //   label: 'ETH'
        // }
      ],
      rules: {
        coin_type: [
          { required: true, trigger: 'blur', message: '请选择币种' }
        ],
        address: [
          { required: true, trigger: 'blur', message: '请输入白名单提现地址' }
        ],
        remark: [
          { required: true, trigger: 'blur', message: '请输入备注' }
        ],
        status: [
          { required: true, trigger: 'blur', message: '请选择状态' }
        ]
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
      this.ifEdit = false
      this.title = '新增'
      this.form = {}
      this.dialogFormVisible = true
      if (rowData) {
        this.title = '编辑'
        this.ifEdit = true
        this.form = { ...rowData }
      }
    },
    // 确认=======
    handleSubmit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.ifEdit) {
            return this.editWhite()
          }
          addWithdrewAddress(this.form).then(res => {
            if (res.status !== 200) {
              return this.$message.error(res.msg)
            }
            this.$message.success('新增成功')
            this.dialogFormVisible = false
            this.$parent.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑
    async  editWhite() {
      const res = await updateWithdrawAddress(this.form)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('编辑成功')
      this.dialogFormVisible = false
      this.$parent.getList()
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
