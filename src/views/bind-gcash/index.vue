<template>
  <div class="app-container">
    <FilterForm
      :warnTxt="warnTxt"
      :statusOptions="statusOptions"
      :curOptions="curOptions"
      @submit="handleQuery"
    />
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >
          新增GCash
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="configList">
      <el-table-column label="序号" align="center" type="index" :index="indexNum" />
      <el-table-column label="GCash账号" align="center" prop="bank_account" />
      <el-table-column label="持有人姓名" align="center" prop="user_name" />

     <el-table-column label="二维码链接" align="center" prop="qr_code">
       <template slot-scope="{row}">
         <img :src="row.qr_code" width="80px" height="80px" />
        </template>
      </el-table-column>

      <el-table-column label="币种" align="center" prop="currency" />

      <el-table-column label="可使用额度" align="center" prop="left_amount">
        <template slot-scope="scope">
          <span :class="returnClass(scope.row)">{{
            $toThousands(scope.row.left_amount)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提醒阈值额度" align="center" prop="notice_amount">
        <template slot-scope="scope">
          <span>{{ $toThousands(scope.row.notice_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        :show-overflow-tooltip="true"
        prop="mark"
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "上架" : "下架" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdateStatus(scope.row)"
            v-hasPermi="['system:config:edit']"
            >{{ scope.row.status == 0 ? "上架" : "下架" }}</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(scope.row)"
            v-hasPermi="['system:config:edit']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :total="total"
      :page-size="20"
      :current-page.sync="queryParams.page"
      :page-sizes="[10, 20, 30, 40]"
      layout=" prev, pager, next,sizes,jumper,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="所属角色" prop="group">
          <el-select
            v-model="form.group"
            placeholder="所属角色"
            clearable
            multiple
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in roleOptions"
              :key="dict"
              :label="dict"
              :value="dict"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="GCash账号" prop="">
          <el-input v-model="form.bank_account" placeholder="输入账号" />
        </el-form-item>
        <el-form-item label="持有人姓名" prop="">
          <el-input v-model="form.user_name" placeholder="输入姓名" />
        </el-form-item>
        <el-form-item label="收款二维码链接" prop="">


          <el-input
            v-model="form.qr_code"
            type="text"
          />

          <el-upload
            ref="uploader"
            class="upload-demo"
            :action="uploadUtil.apiUrl"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="1"
          >
            <el-button
              size="small"
              type="primary"
            >
              点击上传
            </el-button>
          </el-upload>

        </el-form-item>

        <el-form-item label="币种">
          <el-select
            v-model="form.currency"
            placeholder="请选择"
            clearable
            size="small"
            style="width: 140px"
          >
            <el-option
              v-for="dict in curOptions"
              :key="dict"
              :label="dict"
              :value="dict"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="可使用额度" prop="">
          <el-input v-model="form.amount" placeholder="输入额度" />
        </el-form-item>
        <el-form-item label="阈值提醒额度" prop="">
          <el-input v-model="form.notice_amount" placeholder="输入额度" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input type="textarea" v-model="form.mark" placeholder="输入备注"  :maxlength="100" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
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
  BankCardAdd,
  BankList,
  BankChangeStatus,
  BankDelete,
  BankEdit,
} from "@/api/bank.js";
import { getToken } from "@/utils/auth";
import { roleList } from "@/api/theme/order/index";
import { upload } from 'library'

import FilterForm from "./components/FilterForm.vue";
import mixins from "./mixins";

export default {
  components: {
    FilterForm,
  },
  mixins: [mixins],
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
      // 表格数据
      configList: [],

      // 查询参数
      queryParams: {
        page: 1,
        size: 20,
      },
      // 表单
      form: {
        bank_title: "",
        user_name: "",
        bank_account: "",
        currency: "",
        amount: "",
        notice_amount: "",
        mark: "",
        status: 1,
      },
      rules: {
        site: [
          { required: true, trigger: "change", message: "所属站点不能为空" },
        ],

        channel: [
          { required: true, trigger: "blur", message: "账号渠道不能为空" },
        ],
        channel_type: [
          { required: true, trigger: "blur", message: "渠道交易类别不能为空" },
        ],
        channel_account: [
          { required: true, trigger: "blur", message: "收款卡号不能为空" },
        ],
        channel_name: [
          { required: true, trigger: "blur", message: "收款账户姓名不能为空" },
        ],
        group: [
          { required: true, trigger: "change", message: "所属角色不能为空" },
        ],
      },
      roleOptions: [],
      curOptions: [],
      uploadUtil: null,
    };
  },
  created() {
    this.getCurrency();
    this.uploadUtil = new upload({ env: process.env.NODE_ENV, model: 'diyfiler' })

  },

  methods: {
    async getCurrency() {
      this.curOptions = await this.$store.dispatch("GetCurrencyList");
    },

    handleChange(val) {
      this.form.group = [];
      this.getRole();
    },
    getRole() {
      roleList({
        token: getToken(),
        page: 1,
        size: 999,
        status: 1,
        site: this.form.site,
      }).then((res) => {
        if (res.code === 200) {
          this.roleOptions = res.data;
        }
      });
    },

    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      BankList({ ...this.queryParams })
        .then((response) => {
          if (response.code === 200) {
            let data = response.data || [];

            this.configList = data.content;
            this.total = data.total;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = true;
        });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改";

      if (row.flag == 1) {
        this.title = "新增";
      } else {
        this.open = true;
        this.form = { ...row,
        amount: row.left_amount };
      }
    },

    /** 搜索按钮操作 */
    handleQuery(param) {
      this.queryParams = {
        page: 1,
        size: 20,
        ...param,
      };
      this.getList();
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
    /** 提交按钮 */
    submitForm() {

      this.$refs['uploader'].clearFiles();

      if (this.form.id) {
        let obj = { ...this.form , bank_title: 'gcash',};
        delete obj.created_at;
        delete obj.updated_at;

        BankEdit(obj)
          .then((res) => {
            if (res.code == 200) {
              this.reset();
              this.getList();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch();
      } else {
        BankCardAdd({ ...this.form , bank_title: 'gcash',})
          .then((res) => {
            if (res.code == 200) {
              this.reset();
              this.getList();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch();
      }
    },
    reset() {
      this.form = {
        bank_title: "gcash",
        user_name: "",
        bank_account: "",
        currency: "",
        amount: "",
        notice_amount: "",
        mark: "",
        status: 1,
      };
      this.open = false;
    },

    handleAdd() {
      this.reset()
      this.open = true;
      this.handleUpdate({ flag: 1 });
    },
    handleDel({ id }) {
      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          BankDelete({ id })
            .then((res) => {
              if (res.code != 200) {
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("删除成功");
              this.getList();
            })
            .catch();
        })
        .catch();
    },

    handleUpdateStatus(row) {
      BankChangeStatus({
        id: row.id,
        status: Number(!row.status),
      })
        .then((res) => {
          this.getList();
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("操作成功");
        })
        .catch();
    },
    returnClass({ left_amount, notice_amount }) {
      if (Number(left_amount) < Number(notice_amount)) {
        return "red";
      }
    },


   handleSuccess(file) {
    if (1 === file.status) {
      const _data = this.uploadUtil.getData(file)
      this.form.qr_code = _data.addressHttps
    } else {
      this.$message.error('上传失败，重新上传');

    }
  },
 beforeAvatarUpload(file) {

    this.form.type = file.type


     const fileReg = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!fileReg.test(file.name)) {
        this.$message.warning('图仅支持jpg、jpeg、png')
        return false
      }
      if (!isLt1M) {
        this.$message.warning('图大小不能超过 1MB!')
        return false
      }
      return true
  }

  },
};
</script>


<style scoped>
.el-table .cell {
  padding: 0 !important;
}

.el-button--mini {
  padding: 7px 10px;
}

.red {
  color: red;
}
</style>
