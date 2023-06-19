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
      <el-form ref="form" label-width="100px" label-suffix=":" :model="form" :rules="dialogRule">
        <el-form-item label="代理线" prop="agent_group">
          <el-input v-model="form.agent_group" />
        </el-form-item>
        <el-form-item label="推广域名" prop="agent_host">
          <el-input v-model="form.agent_host" />
        </el-form-item>
        <el-form-item label="跳转域名" prop="main_host">
          <el-input v-model="form.main_host" />
        </el-form-item>
        <el-form-item label="域名备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="到期时间" prop="host_expire_at">
          <el-date-picker
            v-model="form.host_expire_at"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="w-100"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { create, update } from '@/api/theme/domain/promotion'
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
      dialogTitle: '新增',
      form: {
        status: 1
      },
      dialogRule: {},
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
      if(rowData){
        this.form = { 
          ...rowData, 
          platform: selSite
        }
        this.dialogTitle = "编辑";
      }else{
        this.form = {
          status: 1,
          platform: selSite
        };
        this.dialogTitle = "新增";
      }
      this.formVisible = true
    },
    
    handleConfirm () {
      if(this.form.id){
        this.edit();
      }else{
        this.create();
      }
    },

    create(){
      create(this.form).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$parent.getList()
        this.$message.success('创建成功')
        this.formVisible = false
      })
    },

    edit(){
      update(this.form).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$parent.getList()
        this.$message.success('编辑成功')
        this.formVisible = false
      })
    }
   
  }

}

</script>
<style lang='scss' scoped>
</style>
