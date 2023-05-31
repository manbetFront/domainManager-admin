<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="7">
        <div class="mb20">角色</div>
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="" prop="name">
            <el-input
              placeholder="输入角色"
              v-model="queryParams.name"
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
          </el-form-item>
        </el-form>
        <ul class="role-box">
          <li
            v-for="item in roleList"
            :key="item.id"
            class="role"
            @click="changeRole(item)"
            :class="{ active: roleIndex === item.id }"
          >
            {{ item.name }}
          </li>
        </ul>
        <el-pagination
          v-show="roleTotal > 0"
          :total="roleTotal"
          :current-page.sync="queryParams.page"
          layout=" prev,pager,next"
          @current-change="handleRoleChange"
        />
      </el-col>
      <el-col :span="16">
        <el-row :gutter="10" class="mb20" type="flex" justify="space-between">
          <el-col><div>白名单</div></el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              :disabled="!roleIndex"
              v-hasPermi="['system:menu:add']"
              >新增</el-button
            >
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="configList">
          <el-table-column label="IP" align="center" prop="ip" />
          <el-table-column label="备注" align="center" prop="msg" />
          <el-table-column label="操作时间" align="center" prop="created_at" />
          <el-table-column label="操作人" align="center" prop="opt_user" />

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDel(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total > 0"
          :total="total"
          :page-size="10"
          :current-page.sync="whitePagination.page"
          :page-sizes="[10, 20, 30, 40]"
          layout=" prev, pager, next,sizes,jumper,total"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="76px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.msg" placeholder="请输入备注" />
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
import {
  roleList,
  SystemWhiteList,
  SystemWhiteAdd,
  SystemWhiteDel,
} from "@/api/system";
import { getToken } from "@/utils/auth";
export default {
  name: "systemWhitelist",
  data() {
    return {
      //
      roleLoading: true,
      // 遮罩层
      loading: false,
      // 弹窗开关
      open: false,
      // 防止重复提交
      sureClick: true,
      // title
      title: "",
      roleTotal: 0,
      roleIndex: null,
      roleName: null,
      // 总条数
      total: 0,
      roleList: [],
      // 表格数据
      configList: [],
      whitePagination: {
        page: 1,
        size: 15,
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 15,
        name: "",
      },
      // 表单
      form: {
        ip: "",
        msg: "",
      },
      rules: {
        ip: [{ required: true, trigger: "blur", message: "IP不能为空" }],
      },
    };
  },
  components: {},
  watch: {
    roleName: {
      handler(val) {
        if(val) {
           this.handleWhite();
        }

      },
      immediate: true,
    },
  },
  created() {
    this.handleQuery();
  },
  methods: {
    // 角色列表
    getRoleList() {
      this.roleLoading = true;
      roleList({ ...this.queryParams }).then((response) => {
        if (response.code === 0) {
          this.roleList = response.data.data;
          this.roleTotal = response.data.total;
          this.roleLoading = false;
        }
      });
    },
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      SystemWhiteList({ ...this.whitePagination, group: this.roleName}).then(
        (response) => {
          if (response.code === 200) {
            this.configList = response.data.content;
            this.total = response.data.total;
            this.loading = false;
          }
        }
      );
    },

    /** 新增按钮操作 */
    handleAdd() {
      if (this.roleName) {
        this.form = {
          msg: "",
          ip: "",
        };
        this.open = true;
        this.title = "新增";
      }
    },
    /** 删除 */
    handleDel(row) {
      SystemWhiteDel({ id: row.id }).then((res) => {
        if (res.code === 200) {
          this.handleWhite();
          this.msgSuccess("白名单删除成功");
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getRoleList();
    },
    /** 白名单 */
    handleWhite() {
      this.whitePagination.page = 1;
      this.getList();
    },
    changeRole(item) {
      this.roleIndex = item.id;
      this.roleName = item.name;
    },
    // 角色列表改变
    handleRoleChange(val) {
      this.queryParams.page = val;
      this.getRoleList();
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.whitePagination.page = val;
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.sureClick) {
            this.sureClick = false;
            SystemWhiteAdd({ ...this.form, group: this.roleName })
              .then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("白名单新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
                this.sureClick = true;
                this.getType();
              })
              .catch((err) => {
                this.sureClick = true;
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.role-box {
  list-style: none;
  padding: 0;
  min-height: 500px;

  .role {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    color: #495060;
    outline: none;
    vertical-align: baseline;
    list-style: none;

    &:hover {
      background: #f1f1f1;
      color: #1890ff;
    }

    &.active {
      color: #1890ff;
    }
  }
}

.el-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
