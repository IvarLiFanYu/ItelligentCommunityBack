<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button type="primary" size="mini"  @click="showAdd()" >添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="feeCycle" label="缴费周期">
        <template slot-scope="scope">
          {{scope.row.feeCycle === '1'?'年/周期':'月/周期'}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="价格" />
      <el-table-column label="修改" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.feeId)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹出添加页面-->
    <el-dialog title="账单项添加" :visible.sync="dialogFormVisible">
      <el-form :model="item">
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="item.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="item.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="周期" :label-width="formLabelWidth">
          <el-select v-model="item.feeCycle" placeholder="请选择">
            <el-option
              v-for="item in cycleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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

  import itemApi from '@/api/fee/item'
  import cycleApi from '@/api/fee/cycle'

  export default {
    data() {
      return {
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        item:{
          feeId: '',
          feeCycle: '',
          amount: 0,
          name: ''
        },
        cycleList: [],
        //测试弹出框
        dialogFormVisible: false,
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
        itemApi.save(this.item).then(response=>{
          this.item = {}
          this.fetchData()
        })
      },
      showAdd() {
        cycleApi.findAll().then(response=>{
          this.cycleList = response.queryResult.list
          this.dialogFormVisible = true
        })
      },
      showUpdate(row) {
        this.item.name = row.name
        this.item.feeId = row.feeId
        this.item.feeCycle = row.feeCycle
        this.item.amount = row.amount
        this.dialogFormVisible = true
      },
      // 加载列表数据
      fetchData() {
        // 异步获取远程数据（ajax）
        itemApi.findAll().then(response=>{
          this.list = response.queryResult.list
          // 数据加载并绑定成功
          this.listLoading = false
        })
      },
      // 根据id删除数据
      removeDataById(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          return itemApi.removeById(id)
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
