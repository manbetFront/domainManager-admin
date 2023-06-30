<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="所属站点" prop="site">
        <el-select
          v-model="queryParams.site"
          placeholder="所属站点"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="(dict, value) in siteOptions"
            :key="dict"
            :label="dict"
            :value="value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:menu:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增权限</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="configList">
      <el-table-column label="所属站点" align="center" prop="site">
        <template slot-scope="scope">
          <span>{{ siteOptions[scope.row.site] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center" prop="group" />
      <el-table-column
        label="角色描述"
        :show-overflow-tooltip="true"
        align="center"
        prop="describe"
      />

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class="small-padding"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleUpdateStatus(row)">
            {{ row.status ? "禁用" : "启用" }}
          </el-button>

          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :total="total"
      :page-size="10"
      :current-page.sync="queryParams.page"
      :page-sizes="[10, 20, 30, 40]"
      layout=" prev, pager, next,sizes,jumper,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择角色" prop="rolesList">
          <el-select
            v-model="form.rolesList"
            multiple
            placeholder="选择角色"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in roleOptions"
              :key="dict.id"
              :label="dict.name"
              :value="dict.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属站点" prop="site">
          <el-select
            v-model="form.site"
            placeholder="所属站点"
            clearable
            size="small"
            style="width: 120px"
          >
            <el-option
              v-for="(dict, value) in siteOptions"
              :key="dict"
              :label="dict"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input
            v-model="form.describe"
            type="textarea"
            placeholder="角色描述"
            :maxlength="100"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, GetSite } from '@/api/system'
import {
  PowerAdd,
  PowerList,
  PowerUpdate,
  PowerDel,
  PowerEdit
} from '@/api/power'
import { getToken } from '@/utils/auth'
export default {
  name: 'SystemCompetence',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹窗开关
      open: false,
      // 防止重复提交
      sureClick: true,
      // title
      title: '',
      // 总条数
      total: 0,
      per_page: 0,
      // 表格数据
      configList: [],
      // 站点
      siteOptions: {},
      // 站点
      roleOptions: [],
      // 状态
      statusOptions: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],

      // 查询参数
      queryParams: {
        page: 1,
        row: 10,
        site: undefined,
        status: undefined
      },
      // 表单
      form: {
        status: 1,
        site: '',
        describe: '',
        rolesList: []
      },
      rules: {
        site: [
          { required: true, trigger: 'change', message: '所属站点不能为空' }
        ],
        rolesList: [
          { required: true, trigger: 'change', message: '所属角色不能为空' }
        ],

        describe: [
          { required: true, trigger: 'blur', message: '描述不能为空' }
        ]
      }
    }
  },
  created() {
    this.handleQuery()
    this.getRole()
    this.getSite()
  },
  methods: {
    getSite() {
      GetSite()
        .then((res) => {
          this.siteOptions = res.data || {}
        })
        .catch()
    },

    getRole() {
      roleList({
        token: getToken(),
        page: 1,
        size: 999,
        status: 1,
        pid: process.env.VUE_APP_PID,
      }).then((res) => {
        if (res.code === 0) {
          this.roleOptions = res.data.data
        }
      })
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      PowerList({ ...this.queryParams, pid: process.env.VUE_APP_PID })
        .then((response) => {
          this.configList = response.data.data
          this.total = response.data.total
          this.loading = false
        })
        .catch(() => {
          this.configList = []
          this.loading = false

          this.total = 0
        })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.form = {
        site: '',
        status: 1,
        rolesList: [],
        describe: ''
      }
      this.resetForm('form')
      this.open = true
      this.title = '新增'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = {
        ...row,
        rolesList: row.group.split(',')
      }
      this.title = '修改'
      this.open = true
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 	pageSize 改变时会触发
    handleSizeChange(val) {
      this.queryParams.row = val
      this.queryParams.page = 1
      this.getList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getList()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.sureClick) {
            this.sureClick = false
            this.form.group = String(this.form.rolesList)
            if (this.form.id) {
              PowerEdit({
                ...this.form,
                pid: process.env.VUE_APP_PID,
              })
                .then((response) => {
                  if (response.code === 200) {
                    this.msgSuccess(response.msg)
                    this.open = false
                    this.getList()
                  } else {
                    this.msgError(response.msg)
                  }
                  this.sureClick = true
                })
                .catch((err) => {
                  console.log(err)
                  this.sureClick = true
                })
            } else {
              PowerAdd({ ...this.form, pid: process.env.VUE_APP_PID, })
                .then((response) => {
                  if (response.code === 200) {
                    this.msgSuccess(response.msg)
                    this.open = false
                    this.getList()
                  } else {
                    this.msgError(response.msg)
                  }
                  this.sureClick = true
                })
                .catch((err) => {
                  console.log(err)
                  this.sureClick = true
                })
            }
          }
        }
      })
    },

    handleDel({ id }) {
      this.$confirm('是否确认删除', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          PowerDel({
            id,
            pid: process.env.VUE_APP_PID,
          }).then((res) => {
            if (res.code === 200) {
              this.msgSuccess('删除成功')
              this.getList()
            } else {
              this.msgError(res.msg)
            }
          })
        })
        .catch()
    },

    handleUpdateStatus(row) {
      PowerUpdate({
        id: row.id,
        status: Number(!row.status),
        pid: process.env.VUE_APP_PID,
      })
        .then((res) => {
          if (res.code === 200) {
            this.msgSuccess('操作成功')
            this.getList()
          } else {
            this.$message.error('操作失败，请稍候再试')
          }
        })
        .catch()
    }
  }
}
</script>

