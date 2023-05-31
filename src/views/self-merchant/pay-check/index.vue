<template>
  <div id="processed" class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="收款方式" prop="">
        <el-select
          v-model="queryParams.method"
          placeholder="全部"
          style="width: 120px"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in sourceOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="币种" prop="">
        <el-select
          v-model="queryParams.currency"
          placeholder="全部"
          style="width: 120px"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in curOptions"
            :key="dict"
            :label="dict"
            :value="dict"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="kwVal" clearable>
          <el-select
            slot="prepend"
            v-model="kwKey"
            style="width: 115px"
            @change="kwVal = ''"
          >
            <el-option
              v-for="(item, i) in kwOptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item label="订单提交时间" prop="">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="收款银行" prop="">
        <el-select
          multiple
          v-model="bankParams"
          placeholder="全部"
          style="width: 120px"
          clearable
          size="small"
        >
          <el-option
            v-for="item in banklist"
            :key="item.bank_title"
            :label="item.bank_title"
            :value="item.bank_title"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="">
        <el-select
          v-model="queryParams.status"
          placeholder="全部"
          style="width: 120px"
          clearable
          size="small"
        >
          <el-option
            v-for="item in statuslist"
            :key="item.name"
            :label="item.name"
            :value="item.val"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="configList"
      @sort-change="onSortChange"
      ref="table1"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="订单号"
        align="center"
        width="150"
        prop="orderNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单提交时间"
        sortable="custom"
        align="center"
        width="180"
        prop="submit_time"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="会员账号"
        sortable
        align="center"
        prop="user_name"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="附言码"
        align="center"
        prop="code"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="币种"
        align="center"
        prop="currency"
        :show-overflow-tooltip="true"
      />

      <el-table-column label="存款金额" sortable align="center" prop="amount">
        <template slot-scope="scope">
          <span>{{ $toThousands(scope.row.amount) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="存款人账号" align="center" prop="pay_account" />
      <el-table-column
        label="存款人姓名"
        align="center"
        prop="pay_user"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="收款方式"
        align="center"
        prop="method"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          {{ returnMethod(row.method) }}
        </template>
      </el-table-column>

      <el-table-column
        label="收款银行"
        sortable
        align="center"
        prop="collection_bank"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="收款账号/银行卡号"
        align="center"
        prop="collection_account"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="收款人姓名"
        sortable
        align="center"
        prop="collection_user"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <span>{{
            row.status == -1
              ? "未通过"
              : row.status == 0
              ? "审核中"
              : row.status == 1
              ? "审核通过"
              : "已失效"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="附件"
        align="center"
        prop="pic_url"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-if="row.pic_url"
            @click="checkbig(row.pic_url)"
          >
            查看
          </el-button>
          <span v-else>无附件</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="primary"
            @click="handleCheck(scope.row)"
            v-hasPermi="['system:config:edit']"
            >查看</el-button> -->

          <el-button size="mini" type="primary" @click="handleCheck(scope.row)"
            >审核</el-button
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
    <el-dialog title="审核" :visible.sync="open" width="700px">
      <div>
        <!-- <el-radio-group v-model="form.check">
          <el-radio :label="1">已查到存款</el-radio>
          <el-radio :label="-1">未查到存款</el-radio>
        </el-radio-group> -->
        <el-row type="flex">
          <el-col>订单号: {{ form.orderNo }}</el-col>
          <el-col>识别码: {{ form.code }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col>会员账号: {{ form.user_name }}</el-col>
          <el-col>存款金额: {{ form.amount }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col>存款人账号: {{ form.pay_account }}</el-col>
          <el-col>收款账号: {{ form.collection_account }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col>存款人姓名: {{ form.pay_user }}</el-col>
          <el-col>收款人姓名: {{ form.collection_user }}</el-col>
        </el-row>
        <el-row type="flex">
          <!-- <el-col>存款人银行: {{ form.method }}</el-col> -->
          <el-col>收款银行: {{ form.collection_bank }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col style="display:flex">
            <div>附件:</div>
            <img
              v-if="form.pic_url"
              style="width:400px;height:auto"
              :src="form.pic_url"
            /><span v-else>无附件</span>
          </el-col>
        </el-row>

        <!-- <el-popover placement="top-start" trigger="click">
          <a :href="form.goodsImg" target="_blank" title="查看最大化图片">
            <img :src="form.goodsImg" style="width: 300px;height: 300px" />
          </a>
          <img
            slot="reference"
            :src="form.goodsImg"
            style="width: 50px;height: 50px; cursor:pointer"
          />
        </el-popover> -->

        <p>备注</p>
        <el-input
          v-model="form.mark"
          type="textarea"
          :rows="3"
          :maxlength="50"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="form.check == 1"
          type="primary"
          size="mini"
          @click="approveRefuse(1)"
          >通过</el-button
        >
        <el-button type="danger" size="mini" @click="approveRefuse(-1)"
          >拒绝</el-button
        >
      </div>
    </el-dialog>

    <!-- 附件大图 -->
    <el-dialog :visible.sync="showpic" width="700px">
      <div>
        <img style="width:100%;height:auto;" :src="pic_url" />
      </div>
    </el-dialog>

    <!-- 通知音效 -->
    <audio ref="dingdong" preload="metadata" src="~@/assets/dingdong.wav" />
  </div>
</template>

<script>
import mqtt from "mqtt";
import { OrderList, OrderCheck } from "@/api/pay-check";
import { BankList, removeDup } from "@/api/bank";

function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      total: 0,
      queryParams: {
        page: 1,
        size: 10,
        methods: "",
        currency: "",
        collection_bank: "",
        status: "",
        order_by: "",
        sort_type: ""
      },
      banklist: [],
      statuslist: [
        { name: "待审核", val: 0 },
        // { name: "审核失败", val: -1 },
        // { name: "审核成功", val: 1 },
        { name: "已失效", val: -3 }
      ],
      // 站点
      curOptions: [],
      sourceOptions: [
        {
          value: "bank",
          label: "银行卡"
        },
        {
          value: "gcash",
          label: "GCash"
        }
      ],
      time: "",

      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
              const end = new Date(
                new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
              ); //获取当天23:59:59的时间
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              let start = new Date(GetDateStr(-1));
              let end =
                new Date(GetDateStr(-1)).setHours(0, 0, 0, 0) +
                24 * 60 * 60 * 1000 -
                1;

              picker.$emit("pick", [start, end]);
            }
          },

          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      kwOptions: [
        {
          value: 1,
          label: "会员账号"
        },
        {
          value: 2,
          label: "订单号"
        },
        {
          value: 3,
          label: "附言码"
        },
        {
          value: 4,
          label: "存款金额"
        },
        {
          value: 5,
          label: "存款人账号"
        },
        {
          value: 6,
          label: "存款人姓名"
        }
      ],
      kwKey: 1,
      kwVal: "",

      // 弹出层标题
      sureClick: true,
      // 是否显示弹出层
      open: false,
      imgList: [],
      // 表单参数
      form: {},
      // 参数表格数据
      configList: [],
      // 表单校验
      rules: {
        card_id: [
          { required: true, message: "请选择支付卡", trigger: "change" }
        ],

        photosInfo: [
          { required: true, message: "请上传出款证明", trigger: "change" }
        ]
      },
      remark: "",
      innerVisible: false,
      client: null,
      pic_url: "",
      showpic: false,
      bankParams: []
    };
  },
  created() {
    this.getrecebank();
    this.handleQuery();
    this.getCurrency();
  },
  mounted() {
    this.createConnection();
  },
  methods: {
    async getCurrency() {
      this.curOptions = await this.$store.dispatch("GetCurrencyList");
    },

    // 获取收款银行列表
    getrecebank() {
      removeDup().then(res => {
        this.banklist = res.data;
      });
    },
    // 查看附件
    checkbig(pic_url) {
      this.pic_url = pic_url;
      this.showpic = true;
    },

    // 排序
    onSortChange(col) {
      let sort_type = col.order == "descending" ? "desc" : "asc";
      let order_by = col.prop;
      this.queryParams.sort_type = sort_type;
      this.queryParams.order_by = order_by;

      this.getList();
    },

    /** 订阅支付审核订单数 */
    createConnection() {
      const { topic } = this.$store.state.order;
      this.client = mqtt.connect("wss://mqtt.kletuzow.com:443/mqtt");
      // 订阅
      this.client.on("connect", () => {
        this.client.subscribe(topic, error => {
          if (error) {
            console.error("Error:", error);
            return;
          }
          console.log("订阅成功");
        });
      });
      // 回调
      this.client.on("message", (topic, message) => {
        const data = JSON.parse(message.toString());
        console.log(topic, data);
        this.$notify({
          title: "提示",
          type: "warning",
          message: "您有新的支付审核订单，请及时处理"
        });
        this.$nextTick(() => {
          this.$refs["dingdong"].play();
        });
        this.$store.commit("order/SET_NUMS", data);
        this.getList();
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true;
      if (this.time) {
        this.queryParams.submit_time_start = this.newDate(this.time[0]);
        this.queryParams.submit_time_end = this.newDate(this.time[1]);
      }
      this.queryParams.collection_bank = this.bankParams.toString();
      this.queryParams.page = 1;
      this.queryParams.size = 10;
      this.queryParams.search_type = this.kwKey;
      this.queryParams.keywords = this.kwVal || undefined;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        methods: "",
        currency: "",
        order_by: "",
        sort_type: ""
      };
      this.bankParams = [];
      this.time = "";
      this.kwKey = 1;
      this.kwVal = "";
      if (this.$refs.table1) {
        this.$refs.table1.clearSort();
      }
      this.getList();
    },
    /** 查询参数列表 */
    getList() {
      const _obj = {
        ...this.queryParams,
        status_type: 1
      };

      OrderList(_obj).then(response => {
        if (response.code === 200) {
          this.configList = response.data.content;
          this.total = response.data.total;
        } else {
          this.msgError(response.msg);
        }
        this.loading = false;
      });
    },
    // 	pageSize 改变时会触发
    handleSizeChange(val) {
      this.loading = true;
      this.queryParams.page = 1;
      this.queryParams.size = val;
      this.getList();
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.loading = true;
      this.queryParams.page = val;
      this.getList();
    },

    newDate(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
    },

    /** 查看详情操作 */
    // handleUpdate(row) {
    //   orderInfo({ id: row.id }).then((res) => {
    //     if (res.code === 200) {
    //       const _data = res.data[0]
    //       this.form = _data
    //       this.open = true
    //       this.imgList = _data.file ? _data.file.split(',') : []
    //     }
    //   })
    // },

    // handleConfirmOrder(item, num) {
    //   const obj = {
    //     audit_user: item.audit_user,
    //     id: item.id,
    //     status: num
    //   }

    //   if (num == -1) {
    //     obj.audit_mark = this.remark
    //   }

    //   confirmOrder({
    //     ...obj
    //   }).then((res) => {
    //     if (res.code === 200) {
    //       this.open = false
    //       this.innerVisible = false
    //       this.msgSuccess(res.msg)
    //       this.getList()
    //     } else {
    //       this.msgError(res.msg)
    //     }
    //   })
    // },

    handleCheck(row) {
      this.open = true;
      this.form = { ...row, check: 1 };
    },

    approveRefuse(status) {
      const tip = status === 1 ? "您已确定通过此订单" : "您已确定拒绝此订单";
      this.open = false;
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          OrderCheck({
            status,
            id: this.form.id,
            mark: this.form.mark,
            check: this.form.check
          })
            .then(async res => {
              if (res.code !== 200) {
                this.$message.error(res.msg);
                return;
              }
              await this.$store.dispatch("order/fetchOrderNotice");
              this.$message.success("操作成功");
              this.getList();
            })
            .catch();
        })
        .catch(() => {
          this.open = true;
        });
    },
    returnMethod(val) {
      if (!val) return "-";
      const returnVal = this.sourceOptions.find(item => item.value === val);
      return (returnVal && returnVal.label) || "-";
    }
  }
};
</script>
<style lang="stylus" scoped>
.imgBox {
  span {
    margin: 0 10px;

    img {
      max-width: 100px;
      max-height: 100px;
    }
  }
}
</style>
<style lang="stylus">
#processed {
  .text-danger {
    .el-form-item__label {
      color: #ed5565;
    }
  }
}
.el-row{
  margin-bottom:20px;
}
</style>
