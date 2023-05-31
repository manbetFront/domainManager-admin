export default {
  data() {
    return {
    }
  },
  methods: {
    indexNum(index) {
      const page = this.queryParams.page // 当前页码
      const pagesize = this.queryParams.size // 每页条数
      return index + 1 + (page - 1) * pagesize
    }
  }
}
