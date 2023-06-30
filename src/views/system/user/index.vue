<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="nickname">
        <el-input
          placeholder="用户名"
          v-model="queryParams.nickname"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
          >新增账号</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="configList" class="small-padding">
      <el-table-column label="用户名" align="center" prop="nickname" />
      <el-table-column label="登录名" align="center" prop="username" />
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">
          <el-row>
            <span>{{ scope.row.department }}</span>
            <span class="ml5 manager" v-if="scope.row.is_manager == 1"
              >负责人</span
            >
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" prop="group" />
      <el-table-column label="职位" align="center" prop="position" />

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210px">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleUpdateStatus(row)">
            {{ row.status ? "禁用" : "启用" }}
          </el-button>

          <el-button size="mini" type="primary" @click="handleUpdate(row)"
            >修改</el-button
          >
          <el-button size="mini" type="danger" @click="handleDel(row)"
            >删除</el-button
          >
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
        <el-form-item label="登录名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入登录名"
            :disabled="form.id ? true : false"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" :prop="form.id ? '' : 'password'">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-cascader
            :options="departmentsOptions"
            :props="props"
            collapse-tags
            clearable
            v-model="form.department"
            @change="test"
          >
            <!-- <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template> -->
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="rolesList">
          <el-select
            v-model="form.rolesList"
            multiple
            collapse-tags
            placeholder="选择角色"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in roleOptions"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  SystemUserList,
  SystemUserInfo,
  SystemUserEdit,
  SystemUserDel,
  SystemUserAdd,
  roleList,
  SystemDepartmentsList,
  SystemUserUpdate,
} from "@/api/system";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹窗开关
      open: false,
      // 防止重复提交
      sureClick: true,
      // title
      title: "",
      // 总条数
      total: 0,
      // 角色下拉框
      roleOptions: [],
      // 部门下拉框
      departmentsOptions: [],

      configList: [],

      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        nickname: undefined,
      },
      // 表单
      form: {
        department: null,
        nickname: "",
        position: "",
        password: "",
        username: "",
        rolesList: [],
      },
      props: {
        checkStrictly: true,
        value: "id",
        label: "name",
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "登录名不能为空" },
        ],
        nickname: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        position: [
          { required: true, trigger: "blur", message: "职位不能为空" },
        ],
        department: [
          { required: true, trigger: "change", message: "所属部门不能为空" },
        ],
        rolesList: [
          { required: true, trigger: "change", message: "角色不能为空" },
        ],
      },
    };
  },
  components: {},
  created() {
    this.handleQuery();
    roleList({
      token: getToken(),
      page: 1,
      size: 999,
      status: 1,
      pid: process.env.VUE_APP_PID,
    }).then((res) => {
      if (res.code === 0) {
        this.roleOptions = res.data.data;
      }
    });
    SystemDepartmentsList({
      token: getToken(),
      page: 1,
      size: 999,
      pid: process.env.VUE_APP_PID,
    }).then((res) => {
      if (res.code === 0) {
        this.departmentsOptions = res.data;
      }
    });
  },
  methods: {
    test(val) {
      console.log(val);
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      SystemUserList({
        ...this.queryParams,
        pid: process.env.VUE_APP_PID,
      }).then((response) => {
        if (response.code === 0) {
          this.configList = response.data.data;
          this.total = response.data.total;
          this.loading = false;
        }
      });
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.form = {
        department: [],
        nickname: "",
        position: "",
        password: "",
        username: "",
        rolesList: [],
      };
      this.resetForm("form");
      this.open = true;
      this.title = "新增";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      SystemUserInfo({
        id: row.id,
        pid: process.env.VUE_APP_PID,
      }).then((res) => {
        if (res.code === 0) {
          this.form = {
            department: res.data.departments.find((item) => {
              return item.is_activate;
            }).id,

            nickname: res.data.nickname,
            position: res.data.position,
            password: res.data.password,
            username: res.data.username,
            id: res.data.id,
            rolesList: res.data.groups
              ? res.data.groups
                  .filter((item) => {
                    return item.is_activate;
                  })
                  .map((item) => {
                    return item.id;
                  })
              : [],
          };
          this.open = true;
          this.title = "修改";
          this.resetForm("form");
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 	pageSize 改变时会触发
    handleSizeChange(val) {
      this.queryParams.size = val;
      this.queryParams.page = 1;
      this.getList();
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.getList();
    },
    // 删除
    handleDel(row) {
      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          SystemUserDel({
            id: row.id,
            pid: process.env.VUE_APP_PID,
          }).then((res) => {
            if (res.code === 0) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(res.msg);
            }
          });
        })
        .catch();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.sureClick) {
            this.sureClick = false;
            this.form.roles = this.form.rolesList.toString();
            let _string = "";
            console.log(typeof this.form.department);
            if (
              typeof this.form.department === "string" ||
              typeof this.form.department === "number"
            ) {
              _string = this.form.department;
            } else {
              console.log(this.form.department);
              _string =
                this.form.department[
                  this.form.department.length - 1
                ].toString();
              console.log(_string);
            }
            let _obj = {
              department: _string,
              nickname: this.form.nickname,
              position: this.form.position,
              password: this.form.password,
              username: this.form.username,
              group: this.form.rolesList.toString(),
              pid: process.env.VUE_APP_PID,
            };
            if (this.form.id) {
              SystemUserEdit({ ..._obj, id: this.form.id })
                .then((response) => {
                  if (response.code === 0) {
                    this.msgSuccess(response.msg);
                    this.open = false;
                    this.form = {
                      department: "",
                      nickname: "",
                      position: "",
                      password: "",
                      username: "",
                      rolesList: [],
                    };
                    this.getList();
                  } else {
                    this.msgError(response.msg);
                  }
                  this.sureClick = true;
                })
                .catch((err) => {
                  this.sureClick = true;
                });
            } else {
              SystemUserAdd({
                ..._obj,
              })
                .then((response) => {
                  if (response.code === 0) {
                    this.msgSuccess(response.msg);
                    this.open = false;
                    this.form = {
                      department: "",
                      nickname: "",
                      position: "",
                      password: "",
                      username: "",
                      rolesList: [],
                    };
                    this.getList();
                  } else {
                    this.msgError(response.msg);
                  }
                  this.sureClick = true;
                })
                .catch((err) => {
                  this.sureClick = true;
                });
            }
          }
        }
      });
    },

    handleUpdateStatus(row) {
      SystemUserUpdate({
        id: row.id,
        status: Number(!row.status),
        pid: process.env.VUE_APP_PID,
      })
        .then((res) => {
          if (res.code == 0) {
            this.msgSuccess("操作成功");
            this.getList();
          } else {
            this.$message.error('操作失败，请稍候再试')
          }
        })
        .catch();
    },
  },
};
</script>

<style lang="stylus" scoped>
.manager {
  background: rgba(115, 209, 61, 1);
  color: #ffffff;
  border-radius: 4px;
  display: inline-block;
  width: 60px;
  height: 22px;
  line-height: 22px;
}
</style>
