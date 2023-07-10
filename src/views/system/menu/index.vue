<template>
  <div class="app-container" v-loading.fullscreen="loading">
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
              placeholder="请输入角色"
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
            :check-strictly="checkStrictly"
            ref="tree"
            :props="defaultProps"
          >
          </el-tree>
        </div>
        <div>
          <el-button
            type="primary"
            v-if="configList.length"
            @click="submitForm"
            >
              保存
            </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { roleList, SystemMenuSave, SystemMenuList } from "@/api/system";
import { getToken } from '@/utils/auth'

export default {
  name: "systemMeunlist",
  data() {
    return {
      //
      loading: false,

      // 防止重复提交
      sureClick: true,
      pageCount: 0,
      roleIndex: null,

      roleList: [],
      // 表格数据
      configList: [],
      checkedList: [],
      saveList: [],
      defaultProps: {
        children: "child",
        label: "name",
      },
      // addList
      addList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 15,
        name: "",
        groups: 1,
        status: 1,
        pid: process.env.VUE_APP_PID,
      },
      checkStrictly: true,
      curItem: {},
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
      this.loading = true;
      roleList({ ...this.queryParams }).then((response) => {
        if (response.code === 0) {
          this.roleList = response.data.data;
          this.pageCount = response.data.last_page;
        }
        this.loading = false;
      });
    },
    /** 菜单列表 */
    getList() {
      this.$refs.tree.setCheckedKeys([]);
      this.checkStrictly = true;
      this.loading = true;
      this.configList = [];
      this.checkedList = [];

      SystemMenuList({
        role_id: this.roleIndex,
        pid: process.env.VUE_APP_PID,
      })
        .then((res) => {
          console.log(res);
          const { code, data } = res;
          if (code == 0 && data && data.data.length) {
            var dataList = data.data.filter ( item => (item.url))
            for(var i = 0; i < dataList.length; i++){
             var arr = dataList[i].child.filter ( item => (item.url))
             dataList[i].child = arr;
            }
            this.configList  = dataList;
            this.getTreeItem(data.data);
            this.loading = false;
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.checkedList);

              const timer = setTimeout(() => {
                this.checkStrictly = false;
                clearTimeout(timer);
              }, 1000);
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });

    },

    getTreeItem(data) {
      data.forEach((ev) => {
        if (ev.selected == 1) {
          this.checkedList.push(ev.id);
          if (ev.child && ev.child.length) {
            this.getTreeItem(ev.child);
          }
        }
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getRoleList();
    },

    changeRole(item) {
      // let _arr = this.$refs.tree.getCheckedKeys()
      this.curItem = item;
      this.roleIndex = item.id;
    },
    // 角色列表改变
    handleRoleChange(val) {
      this.queryParams.page = val;
      this.getRoleList();
    },
    // 点击 tree
    check(currentObj, treeStatus) {
      console.log("currentObj", currentObj);
      console.log("node", treeStatus);
      // 点击子菜单
      if (currentObj.parent_id) {
        const parentNode = this.$refs.tree.getNode(currentObj).parent;
        // 选中子菜单时 ，手动触发选中父级
        if (treeStatus.checkedKeys.includes(currentObj.id)) {
          this.$refs.tree.setChecked(parentNode, true);
        } else {
          // 未选中子菜单 且 有至少一个同父 子菜单被选中时，手动触发选中父级
          if (
            treeStatus.checkedNodes.find(
              (item) => item.parent_id === currentObj.parent_id
            )
          ) {
            this.$refs.tree.setChecked(parentNode, true);
          } else {
            this.$refs.tree.setChecked(parentNode, false);
          }
        }
      } else {
        // 点击父菜单
        // 选中时
        if (treeStatus.checkedKeys.includes(currentObj.id)) {
          currentObj.children.forEach((item, i) => {
            this.$refs.tree.setChecked(item, true, true);
          });
        } else {
          // 未选中时
          currentObj.children.forEach((item, i) => {
            this.$refs.tree.setChecked(item, false, true);
          });
        }
      }
    },

    /** 提交按钮 */
    submitForm() {
      if (this.sureClick) {
        // this.sureClick = false;
        const parentIds = this.$refs.tree.getHalfCheckedKeys() || [];
        const childIds = this.$refs.tree.getCheckedKeys() || [];
        let _checkArr = parentIds.concat(childIds);


        this.loading = true;
        SystemMenuSave({
          id: this.roleIndex,
          name: this.curItem.name,
          column_ids: _checkArr.toString(),
          pid: process.env.VUE_APP_PID,
          token: getToken(),
        })
          .then((response) => {
            this.loading = false;
            if (response.code === 0) {
              this.msgSuccess(response.msg);
              this.checkStrictly = true;
              // this.saveList = _arr
            } else {
              this.msgError(response.msg);
            }
            this.sureClick = true;
          })
          .catch((err) => {
            this.sureClick = true;
          });
      }
    },
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
    // text-align center
    padding-left: 15px;
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
  max-height: 620px;
  overflow: auto;
  text-align: left;
}

.el-pagination {
  // display flex
  // align-items center
  // justify-content center
}
</style>
<style lang="stylus">
.tree {
  .el-tree__empty-block {
    text-align: left !important;
    margin-top: 29px;
  }

  .el-tree__empty-text {
    position: static;
  }
}
</style>
