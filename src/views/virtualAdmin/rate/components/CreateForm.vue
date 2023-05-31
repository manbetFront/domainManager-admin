<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="rulesForm" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="充值币种" prop="deposit_coin_type">
          <el-input v-model="form.deposit_coin_type" placeholder="输入充值币种名称" />
        </el-form-item>
        <el-form-item label="兑换币种" prop="change_coin_type">
          <el-input v-model="form.change_coin_type" placeholder="请输入兑换币种名称" />
        </el-form-item>
        <el-form-item label="允许实时汇率区间" prop="min_range">
          <el-col :span="11">
            <el-input v-model="form.min_range" placeholder="请输入最小值" />
          </el-col>
          <el-col class="line" :span="2" style="text-align:center">-</el-col>
          <el-col :span="11">
            <el-input v-model="form.max_range" placeholder="请输入最大值" />
          </el-col>
        </el-form-item>

        <el-form-item label="手动默认汇率" prop="default_num">
          <el-input v-model="form.default_num" placeholder="手动默认汇率" />
        </el-form-item>

        <el-form-item label="启动模式" prop="user_type">
          <el-radio-group v-model="form.user_type">
            <el-radio :label="2">实时汇率</el-radio>
            <el-radio :label="1">手动汇率</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
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
import { addRate, rateEdit } from '@/api/theme/order/rate'
export default {
  name: 'CreateForm',
  components: {},
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      title: '新增',
      // 表单
      form: {
        user_type: 2,
        status: 1
      },
      ifAdd: true,
      rules: {
        deposit_coin_type: [
          { required: true, trigger: 'blur', message: '输入充值币种名称' }
        ],

        change_coin_type: [
          { required: true, trigger: 'blur', message: '请输入兑换币种名称' }
        ],
        min_range: [
          { required: true, trigger: 'blur', message: '请输入' }
        ],
        default_num: [
          { required: true, trigger: 'blur', message: '请输入手动默认汇率' }
        ],
        user_type: [
          { required: true, trigger: 'blur', message: '请选择启动模式' }
        ],
        status: [
          { required: true, trigger: 'blur', message: '请选择状态' }
        ],
        group: [
          { required: true, trigger: 'change', message: '所属角色不能为空' }
        ]
      }
    }
  },

  computed: {},

  watch: {},

  created() { },

  mounted() { },

  methods: {
    open(rowData) {
      this.form = {}
      if (rowData) {
        this.title = '编辑'
        this.form = { ...rowData }
        this.ifAdd = true
      } else {
        this.title = '新增'
        this.ifAdd = false
      }
      this.dialogFormVisible = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.ifAdd) {
            const obj = { ...this.form }
            rateEdit(obj)
              .then(res => {
                if (res.status === 200) {
                  this.$parent.getList()
                  this.$message.success('编辑成功')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch()
          } else {
            addRate({ ...this.form })
              .then(res => {
                if (res.status === 200) {
                  this.$parent.getList()
                  this.$store.dispatch('order/getNumber1')
                  this.$message.success('新增成功')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch()
          }
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
