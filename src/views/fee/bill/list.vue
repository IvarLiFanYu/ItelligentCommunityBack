<template>
  <div class="app-container">
    <!--催缴按钮-->
    <el-button type="primary" @click="call()">催缴账单</el-button>
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="billId" label="账单id" />
      <el-table-column prop="ownerId" label="业主id" />
      <el-table-column prop="receivable" label="应收价格" />
      <el-table-column prop="createTime" label="账单日期" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="state" label="已缴费">
        <template slot-scope="scope">
          {{scope.row.state === '1000'?'未缴费':'已缴费'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="itemList(scope.row.billId)">账单明细</el-button>
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

    <!-- 弹出账单明细 -->
    <el-dialog title="账单明细" :visible.sync="dialogBillItemVisible">
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="billItemList" stripe style="width: 100%">
        <el-table-column prop="name" label="名字" />
        <el-table-column prop="area" label="面积" />
        <el-table-column prop="feeCycle" label="缴费周期">
          <template slot-scope="scope">
            {{scope.row.feeCycle === '1'?'年/周期':'月/周期'}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="费用" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="floorNum" label="楼栋编号" />
        <el-table-column prop="unitNum" label="单元编号" />
        <el-table-column prop="roomNum" label="房间号" />
        <el-table-column prop="apartment" label="户型" />
        <el-table-column prop="parkingArea" label="停车场编号" />
        <el-table-column prop="parkingSpace" label="停车位编号" />
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
  </div>
</template>

<script>

  import billApi from '@/api/fee/bill'
  import billItemApi from "@/api/fee/billItem";

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
        formLabelWidth: '80px',
        billItemList:[]
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      itemList(billId) {
        billItemApi.getById(billId).then(response=>{
          this.billItemList = response.queryResult.list
        }).then(res=>{
          this.dialogBillItemVisible = true
        })
      },
      //账单催缴
      call() {
        billApi.callBill();
      },
      // 加载列表数据
      fetchData() {
        // 异步获取远程数据（ajax）
        billApi.findAll(this.page,this.limit).then(response=>{
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
          return billApi.removeById(id)
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
