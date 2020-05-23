<template>
  <div class="task">
    <div class="header-name">任务管理 / 任务类型添加</div>
    <div class="main">
      <div class="form_head">
         <div>
           管理搜索:
           <a-input :style="{width:'400px',display:'iline-block'}" />
         </div>
        <div :style="{float:'right'}">
          <a-button class="adddbtn" type="primary" @click="showAddModal()">管理添加</a-button>
        </div>
       </div>
      <table border="1" cellspacing="0">
      <thead>
        <th :style="{width:'10%'}"><span>ID</span> </th>
        <th><span>任务栏目名称</span></th>
        <th><span>任务类型金额</span></th>
        <th :style="{width:'10%'}"><span>排列顺序</span></th>
        <!-- <th :style="{width:'10%'}"><span>显示</span></th> -->
        <th><span>创建时间</span></th>
        <th><span>操作</span></th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="index">
            <td>{{item.task_type_id}}</td>
            <td>{{item.task_type_name}}</td>
            <td>{{item.task_type_base_price}}</td>
            <td>{{item.sort}}</td>
            <!-- <td>
                <a-switch :checked="checked" @change="onChange" />
            </td> -->
            <td>{{item.add_time}}</td>
            <td :style="{textAlign:'center'}">
                <a-button @click="showUpdateModal(item)" type="primary" :style="{marginRight:'20px'}">编辑</a-button>
                <a-button @click="showDelModal(item.task_type_id)" type="primary">删除</a-button>
            </td>
        </tr>
      </tbody>
      </table>
      <div style="text-align:right;padding-top:4px;">
      <a-pagination
        :total="total"
        :pageSize="pagesize"
        :defaultCurrent="1"
        :style="{display:'inline-block'}"
         @change="onChange"
      />
      <span :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}">共{{Math.ceil(total/pagesize)}}页</span>
      </div>
       <a-modal
      title="添加"
      :visible="visible1"
      @ok="add"
      @cancel="handleCancel"
    >
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">任务类型</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入任务类型"  v-model="form.task_type_name"/>
        </a-col>
      </a-row>
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">佣金</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入佣金"  v-model="form.task_type_base_price"/>
        </a-col>
      </a-row>
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">排序</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入排序"  v-model="form.sort"/>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="编辑"
      :visible="visible2"
      @ok="update"
      @cancel="handleCancel"
    >
       <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">任务类型</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入任务类型"  v-model="form.task_type_name"/>
        </a-col>
      </a-row>
       <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">佣金价格</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入佣金"  v-model="form.task_type_base_price"/>
        </a-col>
      </a-row>
       <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">排序</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入佣金"  v-model="form.sort"/>
        </a-col>
      </a-row>
    </a-modal>
     <a-modal
      title="删除"
      :visible="visible3"
      @ok="del"
      @cancel="handleCancel"
    >
      <p>确定要删除吗?</p>
    </a-modal>
    </div>
  </div>
</template>

<script>
let token=sessionStorage.getItem("token")
export default {
  name: "Type",
  data() {
    return {
        list:[],
        checked:true,
        visible1:false,
        visible2:false,
        visible3:false,
        form:{
          task_type_name:'',
          task_type_base_price:'',
          sort:'',
          task_type_id:''
        },
        task_type_id:'',
        total:1,
        page: 1,
        pagesize:10
    };
  },
  watch: {
    '$route': function (to, from) {
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
　　　　this.fetchData(to.query.index)
　　}
  },
  created() {
    this.fetchData()
  },
  methods: {
    add(){
      let {task_type_name,task_type_base_price,sort} =this.form;
      let data= {task_type_name,task_type_base_price,sort}
      this.$http.post('/admin/task_type/save',data,{
        headers:{token}
      }).then(res=>{
        if(res.data.code==200){
          this.$message.success('添加成功');
          this.fetchData();
          this.visible1=false
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    update(){
       let {task_type_id,task_type_name,task_type_base_price,sort} =this.form;
       let data= {task_type_id,task_type_name,task_type_base_price,sort}
      this.$http.post('/admin/task_type/update',data,{
        headers:{token}
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          this.$message.success('更新成功');
          this.fetchData();
          this.visible2=false
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    del(){
      let data={
        task_type_id:this.task_type_id
      }
      console.log(data)
      this.$http.post('/admin/task_type/delete',data,{
        headers:{token}
      }).then(res=>{
         if(res.data.code==200){
          this.$message.success('删除成功');
          this.fetchData();
          this.visible3=false
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    fetchData() {
      let data={
        pagesize:this.pagesize,
        page:this.page
      }
      this.$http
      .post("/admin/task_type/taskTypeList", data,{
        headers: {
            'token': token
        }
      })
      .then(res => {
        console.log(res)
        if (res.data.code == 200||res.data.code=="200") {
          this.list=res.data.data.task_type;
          this.total=res.data.data.total;
        }else{
           this.$message.warning(res.data.msg)
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    showAddModal(){
      this.visible1=true;
      this.form={
          task_type_name:'',
          task_type_base_price:'',
          sort:'',
          task_type_id:''
      }
    },
    showUpdateModal(item){
      console.log(item)
      this.visible2=true;
      let data={
        task_type_id:item.task_type_id
      }
      this.$http.post('/admin/task_type/edit',data,{
        headers:{token}
      }).then(res=>{
        if(res.data.code==200){
          let result=res.data.data.task_type
          this.form={
            task_type_id:result.task_type_id,
            task_type_name:result.task_type_name,
            task_type_base_price:result.task_type_base_price,
            sort:result.sort
          }
        }else{
          this.$message.warning(res.data.msg)
        }
      })
      
    },
    showDelModal(task_type_id){
      this.visible3=true;
      this.task_type_id=task_type_id;
    },
    handleCancel(){
      this.visible1=false;
      this.visible2=false;
      this.visible3=false
    },
    onChange(e) {
      this.page = e;
      this.fetchData();
    }
  }
};
</script>
<style scoped>
.form_head{
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.adddbtn{
  width: 80px;
  margin: 10px 0;
}
.task {
  background-color: #ffffff;
}
.task-search-bar {
  margin-bottom: 5px;
}
table {
  width: 100%;
}
thead th {
  width: 20%;
  color: #252525;
  text-align: center;
}

thead {
  background-color: #f3f5f7;
}
tbody td{
  text-align: center;
  padding:4px 0;
}
table,
th,
td {
  border: 1px solid #ebebeb;
}
.header-name {
  height: 40px;
  border-top: 1px solid #e6e8ea;
  background-color: #edeff1;
  line-height: 40px;
  padding-left: 5px;
}
.userImg{
  width: 100%;
  height: 120px;
  background-color: #EBEBEB;
}
.item{
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #e6e8ea;
  padding-left: 10px;
}
.nobor{
  border-bottom: none;
}
.ant-btn-primary{
    background-color: #01958a;
    border-color: #01958a;
    height: 24px;
    line-height: 24px;
}
.ant-switch-checked {
    background-color: #01958a;
}
</style>
