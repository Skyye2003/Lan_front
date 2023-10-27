<!-- 文件页面 -->
<template>
  <div class="main">
    <navibar/>
    <div class="container" @click="handleBGClick" @contextmenu="openContextMenu($event, null)">
      <!-- 这里使用.stop防止事件传递到父元素 -->
      <el-card v-if="hasFile" v-for="(item) in itemData" @click="handleSelectOnce(item)" @contextmenu.stop="openContextMenu($event, item)">
        <div class="card-content" :class="{'selected': item.selected}">
          <i v-if="item.attribute == 8" class="iconfont icon-File"></i>
          <i v-else class="iconfont icon-file-fill"></i>
          <span>{{item.name}}</span>
        </div>
      </el-card>
      <el-empty v-else description="该目录下没有文件！"/>
      <CreateFileForm
        :cur-start-id="currentStartId"
        :visible="showCreateFileForm"
        :edit-item="oldChoice"
        @close="handleChildClose">
      </CreateFileForm>
      <ContextMenu :visible="showContextMenu" :options-num="contextMenuOptions" :position="contextMenuPosition" @FileAction="handleFileAction"></ContextMenu>
    </div>
  </div>

</template>

<script setup lang="ts">
import { deleteFile, getItemList } from "../api/api";
import { ref, watchEffect } from "vue";
import { useEventStore } from "../store/event";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
export interface item {
  name: string,
  type: string,
  attribute: number,
  startId: number,
  len: number,
  selected: boolean
}

const itemData = ref<item[]>([
  {
    name: '',
    type: '',
    attribute: 0,
    startId: 0,
    len: 0,
    selected: false
  }
])
//上一个选中的
const oldChoice = ref<item>({
  name: '',
  type: '',
  attribute: 0,
  startId: 0,
  len: 0,
  selected: false
})



//该路径下是否有文件
const hasFile = ref(false)
//当前目录路径
const path = ref('/')
//右键菜单的位置（获取鼠标位置）
const contextMenuPosition = ref()
//是否打开右键菜单
const showContextMenu = ref(false)
//右键菜单的选项
const contextMenuOptions = ref(0)
//事件触发store
const eventStore = useEventStore();
//是否打开新建文件或者文件夹的表单
const showCreateFileForm = ref(false)
//当前所在的盘块号（根目录为3）
const currentStartId = ref(3)
//路由组件
const router = useRouter()

//监听navibar的事件，触发了执行对应的操作
watchEffect(() => {
  if (eventStore.eventDataFromNavibar) {
    handleNavibarEvent(eventStore.eventDataFromNavibar)
    eventStore.resetData()
  }
})

//导航栏按键操作
const handleNavibarEvent = (nextPath: any) => {
  switch (nextPath) {
    case 1:
      //返回上一级
      console.log('返回上一级')
      console.log(oldChoice.value.name)
      break
    case 2:
      //返回主页
      console.log('返回主页')
      //更新当前盘块号
      currentStartId.value = 3
      path.value = '/'
      _getItemList()
      break
    default:
      //跳转到指定目录
      console.log('跳转到指定目录' + nextPath)
      path.value = nextPath
      _getItemList()
      break
  }
  return
}


//处理单选
const handleSelectOnce = (item: any) => {
  if (item !== null) {
    //将上一个选中的取消选中
    oldChoice.value.selected = false
    item.selected = !item.selected
    oldChoice.value = item
  }

}

//点击背景取消选中
const handleBGClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  //如果点击的是背景，取消选中
  if(target.className == 'container' || target.className == 'el-empty') {
    oldChoice.value.selected = false
    showContextMenu.value = false
  }

}

//打开右键菜单
const openContextMenu = (event: MouseEvent, selectItem: any) => {
  console.debug(selectItem)
  //防止浏览器自带的上下文菜单生成
  event.preventDefault()

  contextMenuPosition.value = { x: event.clientX, y: event.clientY};

  showContextMenu.value = true;

  const target = event.target as HTMLElement
  console.debug(target.className)
  //如果右键选中的项是栏目，显示栏目的右键菜单，且让对应的栏目进入选中状态
  if(selectItem == null) {
    contextMenuOptions.value = 0
  } else {
    handleSelectOnce(selectItem)
    contextMenuOptions.value = 1
  }
}

//执行右键菜单的操作
const handleFileAction = (index: number) => {
  switch (index) {
    case 1:
      console.log("打开")
      console.log(oldChoice.value)
      //判断是文件还是文件夹，如果是文件夹，进入文件夹
      if(oldChoice.value.attribute == 8) {
        //更新当前路径
        path.value = path.value + oldChoice.value.name + '/'
        //将当前路径传给navibar，更新面包屑
        eventStore.sendDataFromDashboard(oldChoice.value.name)
        _getItemList()
      }
      //如果是文件，打开文件
      else {
        console.log(path.value)
        router.push(`/edit?name=${path.value + oldChoice.value.name + '.' + oldChoice.value.type}&startId=${oldChoice.value.startId}`)
      }
      break
    case 2:
      console.log("删除")
      ElMessageBox.confirm(
        '是否确认删除?',
        '警告',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          //进行删除操作
          console.log(oldChoice.value)
          console.log({
            curStartId: currentStartId.value,
            delStartId: oldChoice.value.startId,
            delName: oldChoice.value.name + '.' + oldChoice.value.type
          })

          deleteFile({
            curStartId: currentStartId.value,
            delStartId: oldChoice.value.startId,
            delName: oldChoice.value.name + '.' + oldChoice.value.type
          }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              ElMessage.success('删除成功')
              _getItemList()
            } else {
              ElMessage.error(res.data.message)
            }
          })

        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
      break
    case 3:
      console.log("属性")
      showCreateFileForm.value = true
      break
    case 4:
      console.log("新建")
      showCreateFileForm.value = true
      break
    case 5:
      console.log("刷新")
      ElMessage.success('刷新成功')
      _getItemList()
      break
  }
  showContextMenu.value = false
}

//子组件关闭事件
const handleChildClose = (params: boolean) => {
  _getItemList()
  showCreateFileForm.value = params
}

//给获取到的数据新增字段
const _getItemList = async () => {
  const { data } = await getItemList({path: path.value})
  //更新当前盘块号
  currentStartId.value = data.data.curDirStartId
  //判断该目录下是否有东西
  if (data.data.list !== null) {
    hasFile.value = true
    itemData.value = data.data.list.map((item: any) => ({
      ...item,
      selected: false
    }))
  } else {
    hasFile.value = false
  }
  console.log("当前打开的目录的盘块号为：" + currentStartId.value)

}
_getItemList()

</script>

<style scoped lang="less">
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card {
  height: 90px;
  width: 90px;
  margin: 15px;
  background-color: rgba(228, 220, 220, 0.98);
  overflow: auto;
  list-style: none;
}

.el-card {
  border: none;
  box-shadow: none;
  width: fit-content; // 例如，宽度为150px
  height: fit-content; // 高度为150px
  overflow: hidden; // 隐藏超出缩略图的内容

}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF00;
  padding: 10px;

  &.selected {
    background-color: #d4e8ef;
  }

  &:hover {
    border: 1px solid #d4e8ef;
  }
}

.el-empty {
  /* 使 el-empty 填满整个 grid 容器 */
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
</style>
