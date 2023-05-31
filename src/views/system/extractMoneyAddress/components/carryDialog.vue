<template>
  <div>
    <el-dialog
      title="提现"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="form"
        :label-width="formLabelWidth"
      >
        <el-form-item label="转出地址">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="余额">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="转入地址">
          <el-select
            v-model="form.name"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="提现金额">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.name"
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
          @click="dialogFormVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'CarryDialog',
  components: {},
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ]

    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    open() {
      this.dialogFormVisible = true
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
