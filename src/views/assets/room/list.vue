<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="searchObj.queryStr" placeholder="格式:楼栋-单元-房屋"/>
      </el-form-item>
      <el-form-item>
        <el-radio v-model="searchObj.state" label="1">已入住</el-radio>
        <el-radio v-model="searchObj.state" label="0">未入住</el-radio>
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
      <el-table-column prop="floorNum" label="楼栋编号" />
      <el-table-column prop="unitNum" label="单元编号" />
      <el-table-column prop="roomNum" label="房屋编号" />
      <el-table-column prop="layer" label="层数" />
      <el-table-column prop="apartment" label="户型" />
      <el-table-column prop="builtUpArea" label="面积" />
      <el-table-column prop="state" label="入住情况">
        <template slot-scope="scope">
          {{scope.row.state === '1'?'已入住':'未入住'}}
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="业主" />
      <el-table-column prop="price" label="房租" />
      <el-table-column prop="feeCycle" label="房租类型" />
      <el-table-column label="修改" width="200" align="center">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand" size="mini" split-button type="primary" icon="el-icon-edit" @click="showUpdate(scope.row)">
            操作
            <el-dropdown-menu size="mini" slot="dropdown">
              <div v-if="scope.row.ownerName === null">
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
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.roomId)"></el-button>
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

    <!-- 绑定业主页面 -->
    <el-dialog title="业主绑定" :visible.sync="dialogBindOwnerVisible">
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input style="width: 180px" v-model="idCard" placeholder="身份证"/>
        </el-form-item>
        <el-button type="success" size='medium' @click="fetchOwner()">查询</el-button>
        <el-button type="danger" size='medium' @click="resetOwner()">清空</el-button>
        <el-button type="primary" size='medium' @click="showAddOwner()">添加</el-button>
      </el-form>
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="ownerList" stripe style="width: 100%">
        <el-table-column prop="ownerId" label="业主ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="idCard" label="身份证号" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="selectOwner(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="ownerPage"
        :total="ownerTotal"
        :page-size="ownerLimit"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        style="padding: 30px 0; text-align: center;"
        layout="sizes, prev, pager, next, jumper, ->, total, slot"
        @current-change="fetchData"
        @size-change="changeSize"
      />
    </el-dialog>

    <!-- 绑定业务页面 -->
    <el-dialog title="业务绑定" :visible.sync="dialogBindItemVisible">
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="itemList" stripe style="width: 100%">
        <el-table-column prop="name" label="业务名字" />
        <el-table-column prop="feeCycle" label="缴费周期">
          <template slot-scope="scope">
            {{scope.row.feeCycle === '1'?'年/周期':'月/周期'}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="费用" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="selectItem(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="ownerPage"
        :total="ownerTotal"
        :page-size="ownerLimit"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        style="padding: 30px 0; text-align: center;"
        layout="sizes, prev, pager, next, jumper, ->, total, slot"
        @current-change="fetchData"
        @size-change="changeSize"
      />
    </el-dialog>

    <!--弹出添加页面-->
    <el-dialog title="房屋添加" :visible.sync="dialogFormVisible">
      <el-form :model="room">
        <el-form-item label="所属楼栋" :label-width="formLabelWidth">
          <el-select v-model="room.floorId" @change="fetchUnit(room.floorId)" placeholder="请选择">
            <el-option
              v-for="item in floorList"
              :key="item.floorId"
              :label="item.floorNum"
              :value="item.floorId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单元" :label-width="formLabelWidth">
          <el-select v-model="room.unitId" placeholder="请选择">
            <el-option
              v-for="item in unitList"
              :key="item.unitId"
              :label="item.unitNum"
              :value="item.unitId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋编号" :label-width="formLabelWidth">
          <el-input v-model="room.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="层数" :label-width="formLabelWidth">
          <el-input v-model="room.layer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="户型" :label-width="formLabelWidth">
          <el-input v-model="room.apartment" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房屋面积" :label-width="formLabelWidth">
          <el-input v-model="room.builtUpArea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="room.remark" autocomplete="off"></el-input>
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

  import roomApi from '@/api/assets/room'
  import unitApi from '@/api/assets/unit'
  import floorApi from '@/api/assets/floor'
  import ownerApi from '@/api/assets/owner'
  import itemApi from '@/api/fee/item'

  const floorList = []
  const unitList = []
  const owner = {
    idCard: ''
  }
  const ownerList = []

  export default {
    data() {
      return {
        itemList:[],
        listLoading: true, // 数据是否正在加载
        list: null, //列表
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        ownerPage: 1,
        ownerTotal: 0,
        ownerLimit: 5,
        searchObj: {}, // 查询表单对象
        multipleSelection: [], // 批量选择中选择的记录列表
        ownerList: ownerList,
        //测试弹出框
        dialogFormVisible: false,
        dialogBindOwnerVisible: false,
        dialogBindItemVisible: false,
        room: {
          roomNum:'',
          unitId:'',
          communityId:'',
          layer:'',
          state: '',
          section:'',
          apartment:'',
          builtUpArea:'',
          createTime:'',
          remark:'',
          roomId: '',
          ownerId:'',
          itemId:'',
          feeCycle:'',
          ownerName:''
        },
        state: '',
        unit:{},
        floorList: floorList,
        unitList: unitList,
        formLabelWidth: '80px',
        owner: owner,
        idCard: '',
        ownerRoom: {
          roomId: '',
          ownerId: ''
        },
        roomItem: {
          roomId: '',
          itemId: ''
        },
        itemList: [],
        itemTotal: [],
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
          return roomApi.unBindOwner(this.ownerRoom)
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
          return itemApi.unBindItem(this.roomItem)
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
        itemApi.findRoomItem().then(response=>{
         // alert(this.roomItem.roomId)
          this.roomItem.roomId = row.roomId
          this.itemList = response.queryResult.list
          this.itemTotal = response.queryResult.total
        }).then(res=>{
          this.dialogBindItemVisible = true;
         // alert(this.roomItem.roomId)
        })
      },
      selectItem(row) {
        this.$confirm('确定将该房屋绑定业主,是否继续?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          this.dialogBindItemVisible = false
         // alert(row.feeId)
          this.roomItem.itemId = row.feeId
          return itemApi.bindItem(this.roomItem)
        }).then(() => {
          this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        this.roomItem.ownerId = row.ownerId
        //console.log(this.ownerRoom.roomId)
        //console.log(this.ownerRoom.ownerId)
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
      beforeHandleCommand(item,row){
        return {
          'command': item,
          'row': row
        }
      },
      selectOwner(row) {
        this.$confirm('确定将该房屋绑定业主,是否继续?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          this.dialogBindOwnerVisible = false
          this.ownerRoom.ownerId = row.ownerId
          return roomApi.bindOwner(this.ownerRoom)
        }).then(() => {
          this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetOwner() {
        this.idCard = ''
        this.bindOwner();
      },
      fetchOwner() {
        ownerApi.getByIdCard(this.idCard).then(response=>{
          this.ownerList = response.queryResult.list
          this.ownerTotal = response.queryResult.total
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
      fetchUnit(floorId) {
        alert(floorId)
        unitApi.findByFloorId(floorId).then(response=>{
          this.unitList = response.queryResult.list
        })
      },
      add() {
        this.dialogFormVisible = false
        roomApi.save(this.room).then(response=>{
          this.room.roomNum='',
          this.room.unitId='',
          this.room.communityId='',
          this.room.layer='',
          this.room.section='',
          this.room.apartment='',
          this.room.builtUpArea='',
          this.room.createTime='',
          this.room.remark=''
          this.fetchData()
        })
      },
      showAdd() {
        floorApi.findAll()
          .then(response=>{
            console.log(response)
            this.floorList = response.queryResult.list
            this.dialogFormVisible = true
          })
      },
      showUpdate(row) {
        alert(row.roomNum)
        this.room.roomNum=row.roomNum,
        this.room.unitId=row.unitId,
        this.room.communityId=row.communityId,
        this.room.layer=row.layer,
        this.room.section=row.section,
        this.room.apartment=row.apartment,
        this.room.builtUpArea=row.builtUpArea,
        this.room.createTime=row.createTime,
        this.room.remark=row.remark
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
        roomApi.getPageList(this.page, this.limit).then(
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
        roomApi.getPageListWithSearch(this.page, this.limit, this.searchObj).then(
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
        alert(id)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          return roomApi.removeById(id)
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
