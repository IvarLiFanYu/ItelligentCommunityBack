<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="searchObj.hospitalName" placeholder="医院名字"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchDataWithQuery()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 工具条 -->
    <div>
      <el-button type="primary" size="mini"  @click="dialogFormVisible = true" >添加</el-button>
    </div>

    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="hospitalId" label="医院ID" />
      <el-table-column prop="hospitalName" label="医院名称" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.floorId)"></el-button>
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

    <!--弹出添加页面-->
    <el-dialog title="医院" :visible.sync="dialogFormVisible">
      <el-form :model="hospital">
        <el-form-item label="医院名称" :label-width="formLabelWidth">
          <el-input v-model="hospital.hospitalName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import hospitalApi from '@/api/treatment/hospital'

  export default {
    data() {
      return {
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        searchObj: {}, // 查询表单对象
        multipleSelection: [], // 批量选择中选择的记录列表
        //测试弹出框
        dialogFormVisible: false,
        hospital: {
          hospitalId: '',
          hospitalName: '',
          statusCd: ''
        },
        formLabelWidth: '80px'
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      add() {
        this.dialogFormVisible = false
        hospitalApi.save(this.hospital).then(response=>{
          this.hospital = {}
          this.fetchData()
        })
      },
      showUpdate(row) {
        console.log(row.hospitalId)
        console.log(row.hospitalName)
        this.hospital.hospitalId = row.hospitalId
        this.hospital.hospitalName = row.hospitalName
        this.dialogFormVisible = true
      },
      // 当页码发生改变的时候
      changeSize(size) {
        console.log(size)
        this.limit = size
        this.fetchData(1)
      },
      // 加载列表数据
      fetchData(page = 1) {
        // 异步获取远程数据（ajax）
        this.page = page
        hospitalApi.getPageList(this.page, this.limit).then(
          response => {
            this.list = response.queryResult.list
            this.total = response.queryResult.total
            // 数据加载并绑定成功
            this.listLoading = false
          }
        )
      },
      // 加载列表数据
      fetchDataWithQuery(page = 1) {
        // 异步获取远程数据（ajax）
        this.page = page
        hospitalApi.getPageListWithSearch(this.page, this.limit, this.searchObj).then(
          response => {
            console.log(this.searchObj)
            this.list = response.queryResult.list
            this.total = response.queryResult.total
            // 数据加载并绑定成功
            this.listLoading = false
          }
        )
      },
      // 重置查询表单
      resetData() {
        this.searchObj = {}
        this.fetchData()
      },
      // 根据id删除数据
      removeDataById(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          return hospitalApi.removeById(id)
        }).then((response) => {
          this.fetchData(this.page)
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style scoped>

</style>
