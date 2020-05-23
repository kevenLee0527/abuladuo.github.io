<template>
  <div class="task">
    <div class="header-name">任务管理 / 任务栏目管理</div>  
    <div class="main">
      <!-- <a-button @click="showAddModal()" type="primary" class="adddbtn">添加</a-button> -->
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
        <!-- <th><span>任务栏目路径</span></th> -->
        <th :style="{width:'10%'}"><span>排列顺序</span></th>
        <th :style="{width:'20%'}"><span>添加时间</span></th>
        <!-- <th :style="{width:'10%'}"><span>显示</span></th> -->
        <th><span>操作</span></th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in taskList" :key="index">
            <td>{{item.task_class_id}}</td>
            <td>{{item.task_class_name}}</td>
            <!-- <td>TaskBarPath</td> -->
            <td>{{item.sort}}</td>
            <td>{{item.add_time}}</td>
            <!-- <td>
                <a-switch :checked="checked" @change="onChange" />
            </td> -->
            <td :style="{textAlign:'center'}">
                <a-button @click="showUpdateModal(item)" type="primary" :style="{marginRight:'20px'}">编辑</a-button>
                <a-button @click="showDelModal(item.task_class_id)" type="primary">删除</a-button>
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
    </div>
    <a-modal
      title="添加"
      :visible="visible1"
      @ok="add"
      @cancel="handleCancel"
    >
     
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">栏目名称</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入账号"  v-model="form.task_class_name"/>
        </a-col>
      </a-row>
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">排序</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入账号"  v-model="form.sort"/>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="删除"
      :visible="visible2"
      @ok="del"
      @cancel="handleCancel"
    >
      <p>确定要删除吗?</p>
    </a-modal>
     <a-modal
      title="编辑"
      :visible="visible3"
      @ok="update"
      @cancel="handleCancel"
    >
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">栏目名称</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入栏目名称"  v-model="form.task_class_name"/>
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
  </div>
</template>

<script>
let token =sessionStorage.getItem('token');
export default {
  name: "Programa",
  data() {
    return {
        list:[1,2,3,4,5],
        checked:true,
        total:1,
        page: 1,
        pagesize:10,
        taskList:[],
        visible1:false,  //添加
        visible2:false,  //删除
        visible3:false,  //编辑
        task_class_id:'',
        form:{
          task_class_id:'',
          task_class_name:"",
          sort:'',
          // add_time:''
        }
    };
  },
  watch: {
    '$route': function (to, from) {
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
　　　　this.fetchData(to.query.index)
　　}
  },
  created(){
    this.fetchData()
  },
  methods: {
    add(){
      let data={
        task_class_name:this.form.task_class_name,
        sort:this.form.sort
      }
      this.$http.post('/admin/task_class/save',data,{
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
      let data=this.form;
      console.log(data)
      this.$http.post('/admin/task_class/update',data,{
        headers:{token}
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          this.$message.success('更新成功');
          this.fetchData();
          this.visible3=false
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    del(){
      let data={
        task_class_id:this.task_class_id
      }
      this.$http.post('/admin/task_class/delete',data,{
        headers:{token}
      }).then(res=>{
         if(res.data.code==200){
          this.$message.success('删除成功');
          this.fetchData();
          this.visible2=false
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    showAddModal(){
      this.visible1=true;
      this.form={
          task_class_id:'',
          task_class_name:"",
          sort:'',
      }
    },
    showDelModal(task_class_id){
      this.task_class_id=task_class_id
      this.visible2=true
    },
    showUpdateModal(item){
      this.visible3=true;
      let {task_class_id,task_class_name,sort,add_time}=item;
      let data={task_class_id,task_class_name,sort,add_time};
      this.$http.post('/admin/task_class/edit',data,{
        headers:{token}
      }).then(res=>{
        console.log(res)
        if(res.data.code==200){
          let result=res.data.data.task_class
          this.form={
            task_class_id:result.task_class_id,
            task_class_name:result.task_class_name,
            sort:result.sort
          }
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleCancel(){
      this.visible2=false;
      this.visible3=false;
      this.visible1=false
    },
    fetchData() {
      let data={
        page:this.page,
        pagesize:this.pagesize
      }
     this.$http.post('/admin/task_class/taskClassList',data,{
       headers:{token}
     }).then(res=>{
       console.log(res)
       if(res.data.code==200){
         this.taskList=res.data.data.task_class;
         this.total=res.data.data.total
       }else{
         this.$message.warning(res.data.msg)
       }
     })
    },
    handleChange(value) {
      console.log(`selected ${value}`);
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
