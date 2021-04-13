<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="searchObj.realName" placeholder="医生名字"/>
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
      <el-table-column prop="realName" label="姓名" />
      <el-table-column prop="tel" label="手机号码" />
      <el-table-column prop="officeOneLevel" label="一级科室" />
      <el-table-column prop="officeTwoLevel" label="二级科室" />
      <el-table-column prop="expert" label="擅长" />
      <el-table-column :formatter="stateFormat" prop="brief" label="简介" />
      <el-table-column prop="hospitalName" label="医院名称" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.doctorId)"></el-button>
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
    <el-dialog title="医生添加" :visible.sync="dialogFormVisible" :before-close="closeDialog">
      <el-form :model="doctor">
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="doctor.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="doctor.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="一级科室" :label-width="formLabelWidth">
          <el-input v-model="doctor.officeOneLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="二级科室" :label-width="formLabelWidth">
          <el-input v-model="doctor.officeTwoLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="擅长" :label-width="formLabelWidth">
          <el-input v-model="doctor.expert" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="doctor.brief" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="医院" :label-width="formLabelWidth">
          <el-select v-model="doctor.hospitalId" placeholder="请选择">
            <el-option
              v-for="item in hospitalList"
              :key="item.hospitalId"
              :label="item.hospitalName"
              :value="item.hospitalId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称" :label-width="formLabelWidth">
          <el-select v-model="doctor.professionalTitleId" placeholder="请选择">
            <el-option
              v-for="item in titleList"
              :key="item.titleId"
              :label="item.titleName"
              :value="item.titleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="身份证正面"  :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="BASE_API+'/cos/uploadCardFront'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="identityImgFront"
            :multiple="false"
            :limit="1"
            :on-success="uploadIdentityImgFrontSuccess"
            list-type="picture">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
          <!--            :on-success="uploadIdentityImgFrontSuccess()"-->
        </el-form-item>
        <el-form-item  label="身份证反面" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="BASE_API+'/cos/uploadCardBack'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="identityImgBack"
            :on-success="uploadIdentityImgBackSuccess"
            list-type="picture">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item  label="执业医师证" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="BASE_API+'/cos/uploadDoctorProfessional'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="zyyszImg"
            :on-success="uploadDoctorImageSuccess"
            list-type="picture">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
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

  import doctorApi from '@/api/treatment/doctor'
  import titleApi from '@/api/treatment/title'
  import hospitalApi from "../../../api/treatment/hospital";

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
        hospitalList:[],
        titleList: [],
        identityImgFront: [],
        identityImgBack:[],
        zyyszImg: [],
        doctor: {
          doctorId: "",
          userId: "",
          realName: "",
          email: "",
          age: 0,
          sex: "",
          tel: "",
          professionalTitleId: "",
          officeOneLevel: "",
          officeTwoLevel: "",
          expert: "",
          brief: "",
          hospitalId: "",
          avatarImg: "",
          identityImgFront: '',
          identityImgBack: '',
          zyyszImg: '',
          levelCd: "",
          createTime: "",
          online: 0
        },
        identityImgFrontObj: {
          name: '身份证正面',
          url: ''
        },
        identityImgBackObj: {
          name: '身份证反面',
          url: ''
        },
        zyyszImgObj: {
          name: '执业医师证',
          url: ''
        },
        formLabelWidth: '100px',
        BASE_API: process.env.BASE_API
      }
    },
    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
      this.fetchData()
    },
    methods: {
      closeDialog() {
        this.doctor = {}
        this.identityImgFront = []
        this.identityImgBack = []
        this.zyyszImg = []
        this.dialogFormVisible = false
      },
      uploadDoctorImageSuccess(res) {
        console.log(res)
        this.doctor.zyyszImg = res
      },
      uploadIdentityImgBackSuccess(res) {
        this.doctor.identityImgBack = res
      },
      uploadIdentityImgFrontSuccess(res, file) {
        this.doctor.identityImgFront = res
      },
      showAdd() {
        this.fetchHospitalList()
        this.fetchTitleList()
        this.dialogFormVisible = true
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 格式化表格消息内容
      stateFormat(row, column, cellValue) {
        // console.log(row , column , cellValue)
        if (!cellValue) return "";
        if (cellValue.length > 7) {
          //最长固定显示4个字符
          return cellValue.slice(0, 7) + "...";
        }
        return cellValue;
      },
      add() {
        this.dialogFormVisible = false
        doctorApi.save(this.doctor).then(response=>{
          this.doctor = {}
          this.identityImgFront=[]
          this.identityImgBack = []
          this.zyyszImg = []
          this.fetchData()
        }).catch(respon=>{
          this.doctor = {}
          this.fetchData()
        })
      },
      showUpdate(row) {
        this.fetchHospitalList()
        this.fetchTitleList()
        this.doctor = row
        this.doctor.professionalTitleId = row.titleId
        this.identityImgFrontObj.url = row.identityImgFront
        this.identityImgFront.push(this.identityImgFrontObj)
        this.identityImgBackObj.url = row.identityImgBack
        this.identityImgBack.push(this.identityImgBackObj)
        this.zyyszImgObj.url = row.zyyszImg
        this.zyyszImg.push(this.zyyszImgObj)
        this.dialogFormVisible = true
      },
      fetchHospitalList() {
        hospitalApi.findAll().then(response=>{
          this.hospitalList = response.queryResult.list
        })
      },
      fetchTitleList() {
        titleApi.findAll().then(response=>{
          this.titleList = response.queryResult.list
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
        doctorApi.getPageList(this.page, this.limit).then(
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
        doctorApi.getPageListWithSearch(this.page, this.limit, this.searchObj).then(
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
          return doctorApi.removeById(id)
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
