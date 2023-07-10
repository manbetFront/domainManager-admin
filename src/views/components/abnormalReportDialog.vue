<template>
  <div>
     <el-dialog
      :title="dialogTitle"
      width="700px"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      append-to-body
    >
      <el-form ref="form" label-width="100px" label-suffix=":" :model="form" :rules="dialogRule">
        <el-row>
          <el-col :span="8">
            <el-form-item label="代理线">
              <span>{{ form.agent_group }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="域名">
              <span>{{ form.url }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label=""> -->
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 5, maxRows: 10}"/>
        <!-- </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="confirming" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  alarmReport
} from "@/api/theme/alarm/index";
export default {
  name: 'EditDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      dialogTitle: '异常回报',
      form: {
        remark: '',
      },
      confirming: false,
      dialogRule: {
        remark: [{ required: true, message: "请输入问题描述", trigger: 'blur' }],
      },
    }
  },

  computed: {
    formVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
  },

  watch: {},

  created () { },

  mounted () {

  },

  methods: {
    open (rowData, selSite) {
        this.form = { 
          ...rowData, 
          platform: selSite
        }
      this.formVisible = true
    },
    
    handleConfirm () {
      if(this.confirming)return;
      this.confirming = true;
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.confirming = false;
          return;
        }
        var params = {
          id: this.form.id,
          remark: this.form.remark,
          platform: this.form.platform,
          host_type: this.form.host_type,
        }
        alarmReport(params).then(res => {
          this.formVisible = false;
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$parent.getList()
          this.$message.success('操作成功')
          this.confirming = false;
        })
      })
    }
   
  }

}

</script>
<style lang='scss' scoped>
</style>
