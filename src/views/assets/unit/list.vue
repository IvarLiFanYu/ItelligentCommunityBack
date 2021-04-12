<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="searchObj.unitId" placeholder="单元id"/>
        <el-input style="width: 180px" v-model="searchObj.unitNum" placeholder="单元编号"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchDataWithQuery()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 工具条 -->
    <div>
      <el-button type="primary" size="mini"  @click="showAdd()" >添加</el-button>
    </div>

    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="unitNum" label="单元编号" />
      <el-table-column prop="floorNum" label="楼栋编号" />
      <el-table-column prop="layerCount" label="总层数" />
      <el-table-column prop="unitArea" label="单元面积" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="lift" label="电梯">
        <template slot-scope="scope">
          {{scope.row.lift === '1'?'有':'无'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.unitId)"></el-button>
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
    <el-dialog title="单元添加" :visible.sync="dialogFormVisible">
      <el-form :model="unit">
        <el-form-item label="单元编号" :label-width="formLabelWidth">
          <el-input v-model="unit.unitNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总层数" :label-width="formLabelWidth">
          <el-input v-model="unit.layerCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单元面积" :label-width="formLabelWidth">
          <el-input v-model="unit.unitArea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="unit.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属楼栋" :label-width="formLabelWidth">
          <el-select v-model="unit.floorId" placeholder="请选择">
            <el-option
              v-for="item in floorList"
              :key="item.floorId"
              :label="item.floorNum"
              :value="item.floorId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电梯" :label-width="formLabelWidth">
          <el-radio v-model="unit.lift" label="1">有</el-radio>
          <el-radio v-model="unit.lift" label="0">无</el-radio>
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

  import unitApi from '@/api/assets/unit'
  import floorApi from '@/api/assets/floor'

  const floorList = []

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
        unit: {
          unitNum: '',
          unitArea: 0.0,
          unitId: '',
          layerCount: '',
          lift: '0',
          floorNum: '',
          floorId: '',
          remark: ''
        },
        floorList: floorList,
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
        unitApi.save(this.unit).then(response=>{
          this.unit.unitNum = ''
          this.unit.unitArea = 0
          this.unit.layerCount = ''
          this.unit.lift = ''
          this.unit.unitId = ''
          this.unit.floorId = ''
          this.unit.floorNum = ''
          this.unit.remark = ''
          this.fetchData()
        })
      },
      showAdd() {
        floorApi.findAll().then(response=>{
          console.log(response)
          this.floorList = response.queryResult.list
          this.dialogFormVisible = true
        })
      },
      showUpdate(row) {
        alert(row.remark)
        this.unit.unitNum = row.unitNum
        this.unit.unitArea = row.unitArea
        this.unit.layerCount = row.layerCount
        this.unit.lift = row.lift
        this.unit.unitId = row.unitId
        this.unit.floorId = row.floorId
        this.unit.floorNum = row.floorNum
        this.unit.remark = row.remark
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
        console.log('我执行了哦!')
        // 异步获取远程数据（ajax）
        this.page = page
        unitApi.getPageList(this.page, this.limit).then(
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
        unitApi.getPageListWithSearch(this.page, this.limit, this.searchObj).then(
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
          return unitApi.removeById(id)
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
