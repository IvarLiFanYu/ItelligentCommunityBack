<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="searchObj.num" placeholder="车位编号"/>
        <el-form-item label="停车场" :label-width="formLabelWidth">
          <el-select v-model="searchObj.parkingId" placeholder="请选择">
            <el-option
              v-for="item in parkingAreaList"
              :key="item.parkingId"
              :label="item.num"
              :value="item.parkingId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态" :label-width="formLabelWidth">
          <el-radio v-model="searchObj.state" label="S">已出租</el-radio>
          <el-radio v-model="searchObj.state" label="F">空闲</el-radio>
        </el-form-item>
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
      <el-table-column prop="parkingNum" label="停车场编号" />
      <el-table-column prop="num" label="车位编号" />
      <el-table-column prop="area" label="面积" />
      <el-table-column prop="ownerName" label="业主名字" />
      <el-table-column prop="itemName" label="费用项名称" />
      <el-table-column prop="price" label="费用" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="typeCd" label="信息">
        <template slot-scope="scope">
          {{scope.row.state === 'F'?'已出租':'未出租'}}
        </template>
      </el-table-column>
      <el-table-column label="修改" width="200" align="center">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand" size="mini" split-button type="primary" icon="el-icon-edit" @click="showUpdate(scope.row)">
            操作
            <el-dropdown-menu size="mini" slot="dropdown">
              <div v-if="scope.row.ownerId === null">
              <el-dropdown-item :command="beforeHandleCommand('bindOwner',scope.row)">绑定业主</el-dropdown-item>
            </div>
              <div v-else>
                <el-dropdown-item :command="beforeHandleCommand('unBindOwner',scope.row)">解绑业主</el-dropdown-item>
              </div>
              <div v-if="scope.row.itemId === null">
                <el-dropdown-item :command="beforeHandleCommand('bindFee',scope.row)">绑定业务</el-dropdown-item>
              </div>
              <div v-else>
                <el-dropdown-item :command="beforeHandleCommand('unBindFee',scope.row)">解绑业务</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.spaceId)"></el-button>
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
    <el-dialog title="车位添加" :visible.sync="dialogFormVisible">
      <el-form :model="parkingSpace">
        <el-form-item label="车位编号" :label-width="formLabelWidth">
          <el-input v-model="parkingSpace.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面积" :label-width="formLabelWidth">
          <el-input v-model="parkingSpace.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="停车场" :label-width="formLabelWidth">
          <el-select v-model="parkingSpace.parkingId" placeholder="请选择">
            <el-option
              v-for="item in parkingAreaList"
              :key="item.parkingId"
              :label="item.num"
              :value="item.parkingId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="parkingSpace.remark" autocomplete="off"></el-input>
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
  import parkingSpaceApi from "@/api/assets/parkingSpace"
  import parkingAreaApi from  "@/api/assets/parkingArea"

  export default {
    data() {
      return {
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        searchObj: {
          parkingId: '',
          num: ''
        }, // 查询表单对象
        multipleSelection: [], // 批量选择中选择的记录列表
        //测试弹出框
        dialogFormVisible: false,
        parkingAreaList:[],
        parkingSpace: {
          spaceId: '',
          num: '',
          typeCd: '',
          state: '',
          area: 0,
          parkingId: '',
          remark: '',
          itemId: '',
          statusCd: '0',
          itemName: '',
          price: 0.0,
          ownerId: '',
          ownerName: ''
        },
        ownerSpace: {
          ownerId: '',
          spaceId: ''
        },
        itemSpace: {
          itemId: '',
          spaceId: ''
        },
        formLabelWidth: '80px'
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      unBindOwner(row) {
        this.$confirm('确定将该业主解绑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          this.dialogBindItemVisible = false
          //   alert(row.ownerId + row.roomId)
          this.ownerRoom.ownerId = row.ownerId
          this.ownerRoom.roomId = row.roomId
          //   alert(row.ownerId + row.roomId)
          return parkingSpaceApi.unBindOwner(this.ownerRoom)
        }).then(() => {
          this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          })
        })
      },
      unBindItem(row) {
        this.$confirm('确定将该业务解绑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          this.dialogBindItemVisible = false
          //   alert(row.itemId + row.roomId)
          this.roomItem.itemId = row.itemId
          this.roomItem.roomId = row.roomId
          //   alert(row.itemId + row.itemId)
          return parkingSpaceApi.unBindItem(this.roomItem)
        }).then(() => {
          this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          })
        })
      },
      bindItem(row) {
        parkingSpaceApi.find().then(response=>{
          // alert(this.roomItem.roomId)
          this.roomItem.roomId = row.roomId
          this.itemList = response.queryResult.list
          this.itemTotal = response.queryResult.total
        }).then(res=>{
          this.dialogBindItemVisible = true;
          // alert(this.roomItem.roomId)
        })
      },
      bindOwner(row) {
        ownerApi.getPageList(this.ownerPage,this.ownerLimit).then(response=>{
          alert(this.ownerRoom.roomId)
          this.ownerRoom.roomId = row.roomId
          this.ownerList = response.queryResult.list
          this.ownerTotal = response.queryResult.total
        }).then(res=>{
          this.dialogBindOwnerVisible = true;
          alert(this.ownerRoom.roomId)
        })
      },
      beforeHandleCommand(item,row){
        return {
          'command': item,
          'row': row
        }
      },
      handleCommand(command){
        switch (command.command) {
          case "bindOwner":
            //console.log(command.row.roomId)
            this.bindOwner(command.row)
            break;
          case "bindFee":
            this.bindItem(command.row)
            break;
          case "unBindFee":
            this.unBindItem(command.row)
            break;
          case "unBindOwner":
            this.unBindOwner(command.row)
        }
      },
      add() {
        this.dialogFormVisible = false
        parkingSpaceApi.save(this.parkingSpace).then(response=>{
          this.parkingSpace = {}
          this.fetchData()
        })
      },
      showAdd() {
        parkingAreaApi.findAll().then(response=>{
          console.log(response)
          this.parkingAreaList = response.queryResult.list
          this.dialogFormVisible = true
        })
      },
      showUpdate(row) {
        alert(row.remark)
        this.row = this.parkingSpace
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
        parkingAreaApi.findAll().then(response=>{
          console.log(response)
          this.parkingAreaList = response.queryResult.list
        })
        parkingSpaceApi.getPageList(this.page, this.limit, null).then(
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
        parkingSpaceApi.getPageListWithSearch(this.page, this.limit, this.searchObj).then(
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
