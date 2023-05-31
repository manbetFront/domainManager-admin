<template>
  <div class="app-container">
    <el-row>
      <el-col :span="11">
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
        <ul class="role-box" v-loading="roleLoading">
          <li
            v-for="item in roleList"
            :key="item.id"
            class="role"
            @click="changeRole(item.id)"
            :class="{ active: roleIndex === item.id }"
          >
            {{ item.name }}
          </li>
        </ul>
        <el-pagination
          v-show="pageCount > 0"
          :page-count="pageCount"
          :page-size="queryParams.size"
          :current-page.sync="queryParams.page"
          layout="prev, pager, next"
          @current-change="handleRoleChange"
        />
      </el-col>
      <el-col :span="8">
        <el-row :gutter="10" class="mb20">
          <el-col><div>菜单</div></el-col>
        </el-row>
        <div class="tree mb20">
          <el-tree
            :data="configList"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedList"
            ref="tree"
            :check-strictly="true"
            @check-change="clickTreeDeal"
            :props="defaultProps"
          >
          </el-tree>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            v-if="configList.length"
            @click="submitForm"
            >保存</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  roleList,
  SystemMenuList,
  SystemMenuSave,
} from "@/api/system";

import { debounce } from '@/utils'

export default {
  name: "systemMenulist",
  data() {
    return {
      //
      roleLoading: true,

      // 防止重复提交
      sureClick: true,
      pageCount:0,
      roleIndex: null,

      roleList: [],
      // 表格数据
      configList: [],
      checkedList: [],
      saveList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      // addList
      addList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 15,
        name: "",
        groups: 1,
      },
    };
  },
  components: {},
  watch: {
    roleIndex: {
      handler() {
        this.getList();
      },
      immediate: false,
    },
  },
  created() {
    this.handleQuery();
  },
  methods: {
    // 角色列表
    getRoleList() {
      this.roleLoading = true;
      roleList({ ...this.queryParams,pid: process.env.VUE_APP_PID }).then((response) => {
        if (response.code === 0) {
          this.roleList = response.data.data;
          this.pageCount = response.data.last_page;

          this.roleLoading = false;
        }
      });
    },
    /** 菜单列表 */
    getList() {
      SystemMenuList({
        role_id: this.roleIndex,
        pid: process.env.VUE_APP_PID,
      }).then((response) => {
        if (response.code === 0) {
          const _data = JSON.parse(JSON.stringify(response.data.data)) || [];
          const _data2 = JSON.parse(JSON.stringify(response.data.data)) || [];
          let _arr = [];
          let _arr2 = [];
          _data.forEach((item) => {
            if (item.selected) {
              _arr2.push(item.id);
            }
            if (!item.parent_id) {
              let _obj = {
                ...item,
                children: [],
              };

              _data2.forEach((val) => {
                if (item.id === val.parent_id) {
                  _obj.children.push(val);
                }
              });
              _arr.push(_obj);
            }
          });
          this.configList = _arr;
          this.checkedList = _arr2;
          this.saveList = _arr2;
        }
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getRoleList();
    },

    changeRole(id) {
      let _arr = this.$refs.tree.getCheckedKeys();
      if (String(this.saveList.sort()) !== String(_arr.sort())) {
        this.$confirm("您还有配置未保存，确定要切换角色吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.roleIndex = id;
          this.saveList = [];
        });
      } else {
        this.roleIndex = id;
      }
    },
    // 角色列表改变
    handleRoleChange(val) {
      this.queryParams.page = val;
      this.getRoleList();
    },
    // 选中事件
    clickTreeDeal(curObj, objStatus) {
      // curObj: 当前节点数据
      // objStatus： 当前节点的状态，选中为 true ,取消选择为false
      // this.$refs.tree.getNode(curObj)：获取当前节点的node
      if (objStatus) {
        // 当前节点选中，勾选父节点
        // const parentNode = this.$refs.tree.getNode(curObj).parent;
        if (curObj.children !== undefined) {
          curObj.children.forEach((item, i) => {
            this.$refs.tree.setChecked(item, true, true);
          });
        }
        // if (parentNode.key !== undefined) {
        //   this.$refs.tree.setChecked(parentNode, true)
        // }
      } else {
        // 当前节点取消选中，所有子节点取消选中
        if (curObj.children !== undefined) {
          curObj.children.forEach((item, i) => {
            this.$refs.tree.setChecked(item, false, true);
          });
        }
      }
      // this.submitForm()
    },


    /** 提交按钮 */
    submitForm: debounce(function()
      {
      if (this.sureClick) {
        // this.sureClick = false;
        let _checkArr = this.$refs.tree.getCheckedKeys() || [];
        let _arr = this.configList;
        _arr.forEach((item) => {
          if (item.children) {
            item.children.forEach((val) => {
              if (
                _checkArr.find((val2) => {
                  return val2 == val.id;
                })
              ) {
                _checkArr.push(item.id);
              }
            });
          }
        });
        _checkArr = [...new Set(_checkArr)];

        this.configList.forEach((item) => {
          let _index = _checkArr.findIndex((val) => {
            return val === item.id;
          });
          if (_index + 1) {
            let _arr2 = item.children.filter((val2) => {
              return _checkArr.find((val) => {
                return val === val2.id;
              });
            });
            if (!_arr2.length) {
              _checkArr.splice(_index, 1);
            }
          }
        });
        SystemMenuSave({
          role_id: this.roleIndex,
          column_ids: String(_checkArr),
          pid: process.env.VUE_APP_PID,
        })
          .then((response) => {
            if (response.code === 0) {
              this.msgSuccess(response.msg);
              this.saveList = _arr;
            } else {
              this.msgError(response.msg);
            }
            this.sureClick = true;
          })
          .catch((err) => {
            this.sureClick = true;
          });
      }
    },1000)

  },
};
</script>

<style lang="stylus" scoped>
.role-box {
  list-style: none;
  padding: 0;
  min-height: 540px;

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

.tree {
  min-height: 620px;
}

.el-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
