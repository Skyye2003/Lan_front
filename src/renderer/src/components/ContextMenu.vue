<!-- 右键上下文菜单 -->
<template>

  <div v-show="props.visible" class="menu-box" :style="{position: 'absolute', top: position.y + 'px', left: props.position.x + 'px' }">
    <div v-for="(item, index) in handleMenuSwitch(props.optionsNum)"
         class="context-menu-item"
         @mouseover="hoveredItem = index"
         @mouseleave="hoveredItem = null"
         @click="handleItemClick(item.index)"
         v-show="props.visible">

      <span>
        <el-icon :size="15">
          <component  :is="getIconComponent(item.name)"></component>
        </el-icon>
        {{item.name}}
      </span>
      <div v-if="index !== handleMenuSwitch(props.optionsNum).length" class="item-separator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { Folder, Delete, Operation, FolderOpened, Refresh } from "@element-plus/icons-vue";

interface MenuItem {
  name: string,
  index: number
}

interface propsType {
  visible: boolean,
  optionsNum: number,
  position: {
    x: number,
    y: number
  }
}

//
interface EmitType {
  (e: "FileAction",params: number): void
}

const emit = defineEmits<EmitType>()

//子组件接收的props
const props = withDefaults(defineProps<propsType>(), {
  visible: () => {
    return false
  },
  optionsNum: () => {
    return 0
  },
  position: () => {
    return {
      x: 0,
      y: 0
    }
  }

})

//鼠标接触到的菜单项
const hoveredItem = ref()

//未选中状态下右击菜单项
const optionsDefault: MenuItem[] = ([
  {
    name: '新建',
    index: 4
  },
  {
    name: '刷新',
    index: 5
  }
])

//选中状态下右击菜单项
const optionsSelected: MenuItem[] = ([
  {
    name: '打开',
    index: 1
  },
  {
    name: '删除',
    index: 2,
  },
  {
    name: '属性',
    index: 3
  }
])

//点击对应的菜单项触发对应的事件
const handleItemClick = (index: number) => {
  switch (index) {
    case 1:
      console.log("打开")
      emit('FileAction', 1)
      break
    case 2:
      console.log("删除")
      emit('FileAction', 2)
      break
    case 3:
      console.log("属性")
      emit('FileAction', 3)
      break
    case 4:
      console.log("新建")
      emit('FileAction', 4)
      break
    case 5:
      console.log("刷新")
      emit('FileAction', 5)
      break
    default:
      console.log("未知")
  }
}

//菜单项切换
const handleMenuSwitch = (MenuCode: number) : MenuItem[] => {
  switch (MenuCode) {
    case 0:
      return optionsDefault
    case 1:
      return optionsSelected
    default:
      return []
  }
}

//获取菜单图标
const getIconComponent = (menuName: string) : any => {
  switch (menuName) {
    case '打开':
      return Folder
    case '删除':
      return Delete
    case '属性':
      return Operation
    case '新建':
      return FolderOpened
    case '刷新':
      return Refresh
    default:
      return Folder
  }
}

</script>

<style scoped lang="less">
.menu-box {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  display: flex;
  flex-direction: column;


}

.context-menu-item {
  padding: 10px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f7f7f7;  // 你可以根据需要更改此颜色以达到你想要的效果
  }

  .item-separator {
    position: absolute;
    bottom: 0;

    height: 1px; // 定义分隔栏的高度
    background-color: #ccc; // 设置分隔栏的颜色，你可以设置为与 el-card 边缘相同的颜色
  }
}
</style>
