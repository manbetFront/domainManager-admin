<template>
  <div>
     <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      append-to-body
    >
      <el-form ref="form" label-width="150px" label-suffix=":" :model="form" :rules="dialogRule">
        <el-form-item label="报告人">
          <span>{{ form.report_user }}</span>
        </el-form-item>
        <el-form-item label="代理线">
          <span>{{ form.agent_group }}</span>
        </el-form-item>
        <el-form-item label="域名">
          <span>{{ form.agent_host }}</span>
        </el-form-item>
        <el-form-item label="问题描述">
          <span>{{ form.remark }}</span>
        </el-form-item>
        <el-form-item label="处理结果描述" prop="result_desc">
          <el-input v-model="form.result_desc" type="textarea" :autosize="{ minRows: 5, maxRows: 10}"/>
        </el-form-item>

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
  alarmHandle
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
      dialogTitle: '域名警报处理',
      form: {
        is_control: 1,
        status: 1
      },
      confirming: false,
      dialogRule: {
        result_desc: [{ required: true, message: "请输入处理结果描述", trigger: 'blur' }],
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
    
    handleConfirm(){
      if(this.confirming)return;
      this.confirming = true;
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.confirming = false;
          return;
        }
        const params = {
          id: this.form.id,
          remark: this.form.result_desc,
          platform: this.form.platform,
        }
        alarmHandle(params).then(res => {
          this.formVisible = false;
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          //提醒 消息变为已读
          this.$store.dispatch("order/setAlarmHandleId", this.form.agent_host_id);
          this.$parent.getList()
          this.$message.success('操作成功')
          this.confirming = false;
        })
      })
    },
   
  }

}

</script>
<style lang='scss' scoped>
</style>
