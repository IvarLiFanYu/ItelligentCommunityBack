<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button type="primary" size="mini"  @click="dialogFormVisible = true" >添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="id" label="流程ID" />
      <el-table-column prop="flowname" label="流程名称"/>
      <el-table-column prop="flowkey" label="流程Key"/>
      <el-table-column prop="filepath" label="流程文件路径" />
      <el-table-column prop="statusCd" label="部署状态">
        <template slot-scope="scope">
          {{scope.row.state == 0?'已部署':'未部署'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="deploy(scope.row.id)">部署</el-button>
          <el-button type="primary" size="mini" @click="showUpdate(scope.row)">修改</el-button>
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

    <!--弹出修改页面-->
    <el-dialog title="流程修改" :visible.sync="dialogFormVisible">
      <el-form :model="flow">
        <el-form-item label="流程名称" :label-width="formLabelWidth">
          <el-input v-model="flow.flowname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="流程key" :label-width="formLabelWidth">
          <el-input v-model="flow.flowkey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" :label-width="formLabelWidth">
          <el-input v-model="flow.filepath" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import flowApi from  '@/api/flow/flow'

  export default {
    data() {
      return {
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        multipleSelection: [], // 批量选择中选择的记录列表
        //测试弹出框
        dialogFormVisible: false,
        flow: {
          id: '',
          flowname: '',
          flowkey: '',
          filepath: '',
          state: 0
        },
        formLabelWidth: '80px'
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      deploy(id) {
        flowApi.deploy(id).then(response=>{
          this.$message({
            type: 'success',
            message: '部署成功!'
          })
          this.fetchData()
        }).catch(exc=>{
          this.$message.error('部署失败');
        })
      },
      showUpdate(row) {
        this.flow.id = row.id
        this.flow.flowname = row.flowname
        this.flow.flowkey = row.flowkey
        this.flow.filepath = row.filepath
        this.dialogFormVisible = true
        console.log(row)
      },
      update() {
        this.dialogFormVisible = false
        flowApi.updateById(this.flow).then(response=>{
          this.flow.id = ''
          this.flow.flowname = ''
          this.flow.flowkey = ''
          this.flow.filepath = ''
          this.fetchData()
        })
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
        flowApi.findAll().then(
          response => {
            this.list = response.queryResult.list
            this.total = response.queryResult.total
            // 数据加载并绑定成功
            this.listLoading = false
          }
        )
      },
      // 重置查询表单
      resetData() {
        this.parkingArea = {}
        this.fetchData()
      },
    }
  }
</script>
<style scoped>

</style>
