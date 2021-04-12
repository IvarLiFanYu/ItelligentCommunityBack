<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="applyOrderId" label="采购项ID" />
      <el-table-column prop="staffId" label="员工ID" />
      <el-table-column prop="userName" label="员工名字" />
      <el-table-column prop="totalPrice" label="金额" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          {{scope.row.state === '1'?'审批中':'审批结束'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="applyItemList(scope.row.applyOrderId)">采购明细</el-button>
          <el-button type="info" size="mini" @click="taskList(scope.row.applyOrderId)">流程明细</el-button>
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

    <!-- 弹出采购项明细 -->
    <el-dialog title="账单明细" :visible.sync="dialogBillItemVisible">
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="purchaseItemList" stripe style="width: 100%">
        <el-table-column prop="applyId" label="采购ID" />
        <el-table-column prop="resourceId" label="资源ID" />
        <el-table-column prop="resourceName" label="资源名称" />
        <el-table-column prop="resCode" label="资源编号" />
        <el-table-column prop="resNum" label="采购数量" />
        <el-table-column prop="totalPrice" label="采购金额" />
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
    </el-dialog>

    <!-- 弹出采购流程明细 -->
    <el-dialog title="流程明细" :visible.sync="dialogInstanceItemVisible">
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="instanceItemList" stripe style="width: 100%">
        <el-table-column prop="activitiName" label="实例名字" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="staffId" label="员工ID" />
        <el-table-column prop="staffName" label="员工名字" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

  import purchaseApi from "@/api/purchase/purchase"
  import flowApi from '@/api/flow/flow'

  export default {
    data() {
      return {
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        //测试弹出框
        dialogFormVisible: false,
        dialogBillItemVisible:false,
        dialogInstanceItemVisible:false,
        formLabelWidth: '80px',
        purchaseItemList: [],
        instanceItemList: []
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      taskList(id) {
        flowApi.taskList(id).then(response=>{
          this.instanceItemList = response.queryResult.list
          this.dialogInstanceItemVisible = true
        })
      },
      applyItemList(applyOrderId) {
        purchaseApi.getItemById('purchase:'+applyOrderId).then(response=>{
          this.purchaseItemList = response.queryResult.list
          this.total = response.queryResult.total
          this.dialogBillItemVisible = true
        })
      },
      // 加载列表数据
      fetchData() {
        // 异步获取远程数据（ajax）
        purchaseApi.findAll(this.page,this.limit).then(response=>{
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
          return purchaseApi.removeById(id)
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
      },
      // 当页码发生改变的时候
      changeSize(size) {
        console.log(size)
        this.limit = size
        this.fetchData(1)
      }
    }
  }
</script>
<style scoped>
</style>
