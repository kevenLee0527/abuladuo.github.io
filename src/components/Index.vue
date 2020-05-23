<template>
  <div class="task">
    <div class="header-name">系统管理 / 网站信息</div>
    <div :style="{padding:'5px 5px'}">
      <a-row :style="{height:'30px',background:'#EBEBEB',border:'1px solid #E2E2E3',borderRight:'none'}">
        <a-col :span="6" :style="{paddingLeft:'10px',borderRight:'1px solid #E2E2E3',height:'30px',lineHeight:'30px'}">
            今日发布任务量：{{detail.today_task}}
        </a-col>
        <a-col :span="6" :style="{paddingLeft:'10px',borderRight:'1px solid #E2E2E3',height:'30px',lineHeight:'30px'}">
            已完成任务量：{{detail.completed}}
        </a-col>
        <a-col :span="6" :style="{paddingLeft:'10px',borderRight:'1px solid #E2E2E3',height:'30px',lineHeight:'30px'}">
            今日新增用户数：{{detail.new_users}}
        </a-col>
        <a-col :span="6" :style="{paddingLeft:'10px',borderRight:'1px solid #E2E2E3',height:'30px',lineHeight:'30px'}">
            今日新增会员数：{{detail.new_vip_users}}
        </a-col>
        
      </a-row>
      <div class="list">
      <div class="list-item">
          <span class="tit">文字内容屏蔽：</span>
          <a-input v-model="detail.shielding_content" :style="{display:'iline-block',width:'400px'}" placeholder="Basic usage" />
      </div>
      <div class="list-item">
          <span class="tit">IP地址屏蔽：</span>
          <a-input v-model="detail.shielding_ip" :style="{display:'iline-block',width:'400px'}" placeholder="Basic usage" />
      </div>
      <div class="list-item">
          <span class="tit">图片上传格式支持：</span>
          <a-input v-model="detail.image_type" :style="{display:'iline-block',width:'400px'}" placeholder="Basic usage" />
      </div>
      <div class="list-item">
          <span class="tit">图片上传文件大小：</span>
          <a-input v-model="detail.image_size" :style="{display:'iline-block',width:'400px'}" placeholder="Basic usage" />
          <span style="padding-left:10px;">KB/<a-icon type="arrow-up" /> 1024KB=1MB</span>
      </div>
      <div class="list-item">
          <span class="tit">会员注册开/关：</span>
          <a-switch v-model="isRegister" @change="onChange" />
      </div>
      <div class="list-item">
          <span class="tit">任务发布开/关：</span>
          <a-switch v-model="isTask" @change="onChange1" />
      </div>
      <div class="list-item">
          <span class="tit">网站维护开/关：</span>
          <a-switch v-model="isMaintain" @change="onChange2" />
      </div>
      <div class="list-item">
          <span class="tit">网站维护说明：</span>
          <a-input v-model="detail.maintain_explain" :style="{display:'iline-block',width:'400px'}" placeholder="网站更新维护中，请稍后访问......" />
      </div>
      <div class="list-item">
          <span class="tit">客服添加：</span>
          <a-input v-model='qq' :style="{display:'iline-block',width:'400px'}"/>
          <a-button @click="addKefu" :style="{marginLeft:'20px'}" type="primary">添加</a-button>
      </div>
      <div class="list-item" v-for="(item,index) in qqList" :key="index">
          <span class="tit">QQ：</span>
          <span>{{item.qq}}</span>
          <a-button :style="{marginLeft:'20px'}" type="primary" @click="deleteQQ(item.id)">删除</a-button>
      </div>
      <div class="list-item nobor" :style="{textAlign:'center'}">
          
          <a-button @click="submit" :style="{marginLeft:'20px'}" type="primary">确认</a-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
let token=sessionStorage.getItem('token')
export default {
  name: "Index",
  data() {
    return {
        checked:false,
        checked1:false,
        checked2:false,
        qqList:[],
        detail:{},
        isRegister:false,
        isTask:'',
        isMaintain:'',
        qq:''
    };
  },
  created(){
      this.fetchData();
      this.getKefuList()
  },
  methods: {
      fetchData(){
          this.$http.post('/admin/system/websiteConfig',{},{
              headers:{token}
          }).then(res=>{
            //   console.log(res)
              if(res.data.code==200){
                  this.detail=res.data.data;
                  this.isTask=res.data.data.is_task==1?true:false;
                  this.isRegister=res.data.data.is_register==1?true:false;
                  this.isMaintain=res.data.data.is_maintain==1?true:false
              }else{
                  this.$message.warning(res.data.msg)
              }
          })
      },
      submit(){
          let detail=this.detail;
          let data={
              shielding_content:detail.shielding_content,
              shielding_ip:detail.shielding_ip,
              image_type:detail.image_type,
              image_size:detail.image_size,
              is_register:this.isRegister==1?1:2,
              is_task:this.isTask==1?1:2,
              is_maintain:this.isMaintain==1?1:2,
              maintain_explain:detail.maintain_explain,
              today_task:detail.today_task,
              completed:detail.completed,
              new_users:detail.new_users,
              new_vip_users:detail.new_vip_users
          }
        //   console.log(data)
        this.$http.post('/admin/system/updateWebsiteConfig',{
            website_config:data
        },{
            headers:{token}
        }).then(res=>{
            if(res.data.code==200){
                this.$message.success('更新成功');
                this.fetchData()
            }else{
                this.$message.warning(res.data.msg)
            }
        })
      },
      getKefuList(){
          this.$http.post('/admin/system/kefuList',{},{
              headers:{token}
          }).then(res=>{
            //   console.log(res)
              if(res.data.code==200){
                  this.qqList=res.data.data
              }else{
                  this.$message.warning(res.data.msg)
              }
          })
      },
      addKefu(){
          this.$http.post('/admin/system/addKefu',{
              qq:this.qq
          },{
              headers:{token}
          }).then(res=>{
              if(res.data.code==200){
                  this.$message.success('添加成功');
                  this.qq=''
                  this.getKefuList()
              }else{
                  this.$message.warning(res.data.msg)
              }
          })
      },
      onChange(checked) {
          this.checked=checked
      },
      onChange1(checked) {
          this.checked1=checked
      },
      onChange2(checked) {
          this.checked2=checked
      },
      deleteQQ(id){
          this.$confirm({
          title: '系统提示',
          content: '确定要删除吗？',
          okText:'确定',
          cancelText:'取消',
          onOk:()=>{
              this.$http.post('/admin/system/DelKefu',{
                  id:id
              },{
                  headers:{token}
              }).then(res=>{
                  if(res.data.code==200){
                      this.$message.success('删除成功');
                      this.getKefuList()
                  }else{
                      this.$message.warning(res.data.msg)
                  }
              })
          },
          onCancel:()=>{
              console.log('2')
          }
      })
      }
  }
};
</script>
<style scoped>
.task {
  background-color: #ffffff;
}
.header-name {
  height: 40px;
  border-top: 1px solid #e6e8ea;
  background-color: #edeff1;
  line-height: 40px;
  padding-left: 5px;
}
.tit{
    display: inline-block;
    width: 150px;
    text-align: right;
}
.list-item{
     padding:5px 0;
    border-bottom:1px solid #e6e8ea;
}
.list{
    border:1px solid #e6e8ea;
    margin-top: 5px;
}
.nobor{
    border-bottom: none;
}
.ant-btn-primary{
    background-color: #01958a;
    border-color: #01958a;
}
.ant-switch-checked {
    background-color: #01958a;
}
</style>
