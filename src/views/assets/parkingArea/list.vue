<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button type="primary" size="mini"  @click="dialogFormVisible = true" >添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="parkingId" label="停车场id" />
      <el-table-column prop="num" label="停车场编号" />
      <el-table-column prop="typeCd" label="停车场类型">
        <template slot-scope="scope">
          {{scope.row.typeCd === '1001'?'地上停车场':'地下停车场'}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建时间" />
      <!--<el-table-column prop="statusCd" label="是否启用">
        <template slot-scope="scope">
          {{scope.row.statusCd === '0'?'启用':'未启用'}}
        </template>
      </el-table-column>-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.parkingId)"></el-button>
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
    <el-dialog title="停车场添加" :visible.sync="dialogFormVisible">
      <el-form :model="parkingArea">
        <el-form-item label="编号" :label-width="formLabelWidth">
          <el-input v-model="parkingArea.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-radio v-model="parkingArea.typeCd" label="1001">地上停车场</el-radio>
          <el-radio v-model="parkingArea.typeCd" label="1002">地下停车场</el-radio>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="parkingArea.remark" autocomplete="off"></el-input>
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

  import parkingAreaApi from  '@/api/assets/parkingArea'

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
        parkingArea: {
          "parkingId": "",
          "communityId": "",
          "num": "",
          "typeCd": "",
          "remark": "",
          "statusCd": ''
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
        parkingAreaApi.save(this.parkingArea).then(response=>{
          this.parkingArea = {}
          this.fetchData()
        })
      },
      showUpdate(row) {
        alert(row.remark)
        this.parkingArea.num = row.num
        this.parkingArea.typeCd = row.typeCd
        this.parkingArea.remark = row.remark
        this.parkingArea.parkingId = row.parkingId
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
        parkingAreaApi.getPageList(this.page, this.limit).then(
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
      // 根据id删除数据
      removeDataById(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          return parkingAreaApi.removeById(id)
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
