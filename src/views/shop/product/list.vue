<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="catalogName" label="目录名字" />
      <el-table-column prop="name" label="商品名字" />
      <el-table-column prop="salePrice" label="销售价" />
      <el-table-column prop="storePrice" label="进价" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="hotBuy" label="是否热卖">
        <template slot-scope="scope">
          {{scope.row.hotBuy === '1'?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="照片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.productPhotoList[0]"
            :preview-src-list="scope.row.productPhotoList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdate(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="removeDataById(scope.row.productId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>

  import productApi from "@/api/shop/product"

  export default {
    data() {
      return {
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 5, // 每页记录数
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        //测试弹出框
        dialogFormVisible: false,
        dialogInstanceItemVisible:false,
        formLabelWidth: '80px',
        productPhotoList: []
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      showUpdate(row) {
        console.log( row.catalogName)
        this.category.catalogName = row.catalogName
        this.category.catalogId = row.catalogId
        this.dialogFormVisible = true
      },
      removeDataById(id)
      {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          return productApi.removeById(id)
        }).then((response) => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.fetchData(this.page)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 当页码发生改变的时候
      changeSize(size) {
        this.limit = size
        this.fetchData(1)
      },
      // 加载列表数据
      fetchData() {
        // 异步获取远程数据（ajax）
        productApi.getPageListWithSearch(this.page,this.limit,this.searchObj).then(response=>{
          this.list = response.queryResult.list
          this.total = response.queryResult.total
          this.productPhotoList = response.queryResult.productPhotoList
          // 数据加载并绑定成功
          this.listLoading = false
        })
      }
    }
  }
</script>
<style scoped>
</style>
