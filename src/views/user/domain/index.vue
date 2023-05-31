<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
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
            v-for="dict in searchSiteOptions"
            :key="dict.site"
            :label="dict.site"
            :value="dict.site"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易渠道类别" prop="channel_type">
        <el-select
          v-model="queryParams.channel_type"
          placeholder="交易渠道类别"
          clearable
          size="small"
          style="width: 140px"
        >
          <el-option
            v-for="dict in searchTypeOptions"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
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
          >新增充值域名</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="所属站点" align="center" prop="site" />
      <el-table-column label="所属角色" align="center" prop="group" />
      <!-- <el-table-column label="渠道类别" align="center" prop="channel_type" /> -->
      <!-- <el-table-column
        label="渠道账户姓名"
        align="center"
        prop="channel_name"
      /> -->
      <el-table-column
        label="前端域名"
        align="center"
        prop="url"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.status == 1
              ? "启用"
              : scope.row.status == -1
              ? "失效"
              : "禁用"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        label="更新时间"
        align="center"
        prop="updated_at"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column
        label="链接失效时间"
        align="center"
        prop="valid_time_end"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="维护人员" align="center" prop="add_user" />
      <el-table-column
        label="会员可用链接"
        align="center"
        min-width="360px"
        prop="valid_url"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="140px"
      >
        <template slot-scope="scope" v-if="scope.row.status !== -1">
          <el-switch
            style="display: block"
            v-model="scope.row.switchSataus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启动"
            inactive-text="禁用"
            @change="switchStatus(scope.row)"
          >
          </el-switch>
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
        <el-form-item label="前端域名" prop="url">
          <el-input
            v-model="form.url"
            placeholder="前端域名"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="所属站点" prop="site">
          <el-select
            v-model="form.site"
            placeholder="所属站点"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in siteOptions"
              :key="dict.site"
              :label="dict.site"
              :value="dict.site"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="group">
          <el-select
            v-model="form.group"
            placeholder="角色"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in groupOptions"
              :key="dict"
              :label="dict"
              :value="dict"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账户渠道" prop="channel">
          <el-select
            v-model="form.channel"
            placeholder="账户渠道"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in channelOptions"
              :key="dict.channel"
              :label="dict.channel"
              :value="dict.channel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易渠道类别" prop="channel_type">
          <el-select
            v-model="form.channel_type"
            placeholder="类别"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in typeOptions"
              :key="dict.channel_type"
              :label="dict.channel_type"
              :value="dict.channel_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收款渠道账户" prop="channel_account">
          <el-select
            v-model="form.channel_account"
            placeholder="收款渠道账户"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in accountOptions"
              :key="dict.channel_account"
              :label="dict.channel_account"
              :value="dict.channel_account"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="取款流水倍数" prop="multiple">
          <el-input-number v-model="form.multiple" controls-position="right" />
        </el-form-item>
        <el-form-item label="到期失效时间" prop="valid_time_end">
          <el-input v-show="false" v-model="form.valid_time_end" />
          <el-date-picker
            v-model="datetimerange"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">{{
          form.id ? "修改" : "添加"
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  domainList,
  domainAdd,
  domainField,
  domainGetSite,
  domainUpdate,
} from "@/api/theme/user/index";
import { roleList } from "@/api/theme/order/index";
import { moneyType } from "@/api/theme/money/index";
export default {
  name: "domain",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹窗开关
      open: false,
      // 防止重复提交
      sureClick: true,
      groupOptions: [],
      // title
      title: "",
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 站点
      searchSiteOptions: [
        {
          site: "MX",
          label: "MX",
        },
        {
          site: "JS2",
          label: "JS2",
        },
        {
          site: "NLD",
          label: "NLD",
        },
      ],
      siteOptions: [],
      // 搜索用交易渠道类别
      searchTypeOptions: [],
      channelOptions: [],
      // 交易渠道类别
      typeOptions: [],
      // 收款渠道账户
      accountOptions: [],
      // 状态
      statusOptions: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "禁用",
        },
        {
          value: -1,
          label: "失效",
        },
      ],
      datetimerange: [],
      // 查询参数
      queryParams: {
        page: 1,
        row: 10,
        site: undefined,
        channel_type: undefined,
        channel_account: undefined,
        status: undefined,
      },
      // 表单
      form: {
        url: "",
        group: "",
        site: "",
        channel: "",
        channel_type: "",
        channel_account: "",
        multiple: 0,
        valid_time_end: "",
        valid_time_start: "",
        status: 1,
      },
      rules: {
        url: [{ required: true, trigger: "blur", message: "前端域名不能为空" }],
        site: [
          { required: true, trigger: "change", message: "所属站点不能为空" },
        ],
        group: [{ required: true, trigger: "change", message: "角色不能为空" }],
        channel_type: [
          {
            required: true,
            trigger: "change",
            message: "交易渠道类别不能为空",
          },
        ],
        channel: [
          { required: true, trigger: "change", message: "账户渠道不能为空" },
        ],
        channel_account: [
          {
            required: true,
            trigger: "change",
            message: "收款渠道账户不能为空",
          },
        ],
        multiple: [
          { required: true, trigger: "blur", message: "取款流水倍数不能为空" },
        ],

        channel_name: [
          { required: true, trigger: "blur", message: "收款账户姓名不能为空" },
        ],
        valid_time_end: [
          { required: true, trigger: "change", message: "失效时间不能为空" },
        ],
      },
    };
  },
  components: {},
  created() {
    this.handleQuery();
    this.getType();
  },
  watch: {
    "form.site": function (val) {
      this.channelOptions = [];
      this.form.channel = "";
      if (val) {
        domainField({
          site: val,
        }).then((res) => {
          if (res.code === 200) {
            this.channelOptions = res.data;
          }
        });
        roleList({
          site: val,
        }).then((res) => {
          if (res.code == 200) {
            this.groupOptions = res.data;
          }
        });
      }
    },
    "form.channel": function (val) {
      this.typeOptions = [];
      this.form.channel_type = "";
      if (val) {
        domainField({
          site: this.form.site,
          channel: val,
        }).then((res) => {
          if (res.code === 200) {
            this.typeOptions = res.data;
          }
        });
      }
    },
    "form.channel_type": function (val) {
      this.accountOptions = [];
      this.form.channel_account = "";
      if (val) {
        domainField({
          site: this.form.site,
          channel: this.form.channel,
          channel_type: val,
        }).then((res) => {
          if (res.code === 200) {
            this.accountOptions = res.data.filter((item) => {
              return item.channel_account;
            });
          }
        });
      }
    },
    datetimerange: function (val) {
      if (val && val.length) {
        this.form.valid_time_start = val[0];
        this.form.valid_time_end = val[1];
      } else {
        this.form.valid_time_end = "";
        this.form.valid_time_start = "";
      }
    },
  },
  computed: {},
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      this.loading = false;
      domainList({ ...this.queryParams }).then((response) => {
        this.list = response.data.map((item) => {
          if (item.status === 1) {
            item.switchSataus = true;
          } else if (item.status === 0) {
            item.switchSataus = false;
          }
          return item;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取各类类型
    getType() {
      moneyType().then((res) => {
        if (res.code === 200) {
          let _arr = res.data;
          let _type = [];
          _arr.map((item, index) => {
            if (item.channel_type) {
              _type.push({
                value: index + 1,
                label: item.channel_type,
              });
              return;
            }
          });
          this.searchTypeOptions = _type;
        }
      });
      domainGetSite().then((res) => {
        if (res.code == 200) {
          this.siteOptions = res.data;
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.datetimerange = [];
      this.form = {
        url: "",
        site: "",
        group: "",
        channel: "",
        channel_type: "",
        channel_account: "",
        multiple: 0,
        valid_time_end: "",
        valid_time_start: "",
        status: 1,
      };

      this.resetForm("form");
      this.open = true;
      this.title = "新增";
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
      this.queryParams.row = val;
      this.queryParams.page = 1;
      this.getList();
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.getList();
    },
    // 切换状态
    switchStatus(row) {
      domainUpdate({ id: row.id, status: row.status == 1 ? 0 : 1 }).then(
        (res) => {
          if (res.code === 200) {
            this.getList();
            if (row.status == 1) {
              this.msgSuccess("禁用成功");
            } else {
              this.msgSuccess("启用成功");
            }
          } else {
            this.msgError(response.msg);
          }
        }
      );
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.sureClick) {
            this.sureClick = false;
            domainAdd({ ...this.form })
              .then((response) => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg);
                  this.open = false;
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
      });
    },
  },
};
</script>

