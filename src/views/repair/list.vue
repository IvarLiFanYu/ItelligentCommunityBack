<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">
      <el-table-column prop="ownerId" label="业主ID" />
      <el-table-column prop="floorNum" label="楼栋编号" />
      <el-table-column prop="unitNum" label="单元编号" />
      <el-table-column prop="roomNum" label="房屋编号" />
      <el-table-column prop="context" label="报修内容" />
      <el-table-column prop="repairName" label="报修人" />
      <el-table-column prop="tel" label="联系电话" />
      <el-table-column prop="appointmentTime" label="约定时间" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          {{scope.row.state === '1'?'处理中':'处理结束'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="taskList(scope.row.repairId)">流程明细</el-button>
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
    <!-- 弹出流程明细 -->
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

  import repairApi from "@/api/repair/repair"
  import flowApi from '@/api/flow/flow'

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
        instanceItemList: []
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      // 当页码发生改变的时候
      changeSize(size) {
        console.log(size)
        this.limit = size
        this.fetchData(1)
      },
      taskList(id) {
        console.log(id)
        flowApi.taskList("repair:"+id).then(response=>{
          this.instanceItemList = response.queryResult.list
          this.dialogInstanceItemVisible = true
        })
      },
      // 加载列表数据
      fetchData() {
        // 异步获取远程数据（ajax）
        repairApi.findAll(this.page,this.limit).then(response=>{
          this.list = response.queryResult.list
          this.total = response.queryResult.total
          // 数据加载并绑定成功
          this.listLoading = false
        })
      }
    }
  }
</script>
<style scoped>
</style>
