<template>
  <div class="searchForm">
    <el-form
      ref="queryForm"
      :model="form"
      :inline="true"
      label-width="80px"
    >
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
        <el-input
          v-model="form.kwVal"
          clearable
        >
          <el-select
            slot="prepend"
            v-model="form.kwKey"
            style="width: 115px"
            @change="form.kwVal = ''"
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
        <el-button
          type="primary"
          size="mini"
          @click="handleQuery"
        >导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  components: {},
  props: {},
  data() {
    return {
      form: {},
      statusOptions: [
        {
          value: 1,
          label: '你好'
        }
      ],
      kwOptions: [
        {
          label: '会员账号',
          value: '2'
        }
      ]
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleQuery() {
      console.log('你好')
    },
    // 重置
    resetQuery() {
      console.log('重置')
    }
  }
}
</script>
<style lang="scss" scoped>
.searchForm {
  // margin-top: 20px;
}
</style>
