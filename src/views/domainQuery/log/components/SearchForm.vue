<template>
  <div class="searchForm">
    <el-form
      ref="queryForm"
      :model="form"
      :inline="true"
      label-width="80px"
      style="margin-left:20px"
    >
      <el-form-item>
        <el-input v-model="form.valueText" clearable>
          <el-select
            slot="prepend"
            v-model="form.typeWay"
            style="width: 115px"
            @change="form.valueText = ''"
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
      <!-- <el-form-item label="域名搜索">
        <el-input v-model="name" placeholder="请输入域名或代理线"></el-input>
      </el-form-item> -->
      <el-form-item label="变更时间">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="form.status"
          placeholder="全部"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
  </div>
</template>

<script>
export default {
  name: "SearchForm",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        status: ""
      },
      statusOptions: [
        {
          label: "异常",
          value: "1"
        },
        {
          label: "已恢复",
          value: "2"
        }
      ],
      kwOptions: [
        {
          label: "域名",
          value: "coin_type"
        },
        {
          label: "代理线",
          value: "net_type"
        }
        // {
        //   label: '钱包地址',
        //   value: 'wallet_address'
        // }
      ]
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleQuery() {
      // 新增===========
      const postData = {};
      postData[this.form.typeWay] = this.form.valueText;
      // end====
      this.form[this.form.typeWay] = this.form.valueText;

      this.$emit("submit", postData);
    },
    // 重置
    resetQuery() {
      this.form = {};
      const obj = {
        valueText: ""
      };
      this.form = { ...obj };
      this.$emit("resetQuery");
    }
  }
};
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
