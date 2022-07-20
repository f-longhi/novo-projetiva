import ProgressSummary from './ProgressSummary.mjs'
import TaskListEditor from './TaskListEditor.mjs'

import {DataStore} from '../storage/DataStore.mjs'

const lists = new DataStore('TaskLists')

async function serialize() {
  return {
    schemaVersion: 1,
    taskLists: await lists.getAll()
  }
}

async function deserialize(data) {
  if (data.schemaVersion !== 1)
    throw new Error('O backup foi criado com uma versão posterior do Projetiva ou algum de seus plugins que tornou-o ilegível pela versão atualmente instalada')
  
  await lists.clear()
  await lists.bulkAdd(data.taskLists)
}

const component = {
  inheritAttrs: false,
  name: 'TabTasks',
  components: {
    ProgressSummary,
    TaskListEditor
  },
  data() {
    return {
      taskLists: [],
      activeIndex: null,
      selectedTaskIndex: null
    }
  },
  computed: {
    currentTaskList() {
      return this.activeIndex === null ? null : this.taskLists[this.activeIndex]
    },
    taskListsSummary() {
      return this.taskLists.map(({name, tasks}) => {
        const taskCount = tasks.length
        return {
          name: name || 'Lista sem título',
          status: (tasks.find(task => !task.done) || {text: taskCount ? 'Concluído' : 'Não há tarefas nesta lista'}).text,
          progress: taskCount ?
            tasks.reduce((acc, task) => task.done ? acc + 1 : acc, 0) * 100 / taskCount :
            0
        }
      })
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      lists.getAll().then(taskLists => {
        this.taskLists = taskLists
      }).catch(err => {
        alert(err)
        console.error(err)
      })
    },
    onRenameCurrentTaskList({name}) {
      this.currentTaskList.name = name
      lists.put(this.currentTaskList)
    },
    onDeleteCurrentTaskList() {
      lists.delete(this.currentTaskList.id)
      this.taskLists.splice(this.activeIndex, 1)
      this.activeIndex = null
      this.selectedTaskIndex = null
    },
    createTaskList() {
      const newTaskList = {
        name: `Nova lista ${this.taskLists.length + 1}`,
        tasks: []
      }
      
      lists.add(newTaskList)
      this.load()
    },
    onRenameTask({ index, name }) {
      this.currentTaskList.tasks[index].text = name
      lists.put(this.currentTaskList)
    },
    onAddTask({ text }) {
      this.currentTaskList.tasks.push({text, done: false})
      lists.put(this.currentTaskList)
    },
    onMoveTaskUp({ index }) {
      const tasks = this.currentTaskList.tasks
      const a = tasks[index], b = tasks[index - 1]
      tasks.splice(index - 1, 2, a, b)
      this.selectedTaskIndex--
      lists.put(this.currentTaskList)
    },
    onMoveTaskDown({ index }) {
      const tasks = this.currentTaskList.tasks
      const a = tasks[index + 1], b = tasks[index]
      tasks.splice(index, 2, a, b)
      this.selectedTaskIndex++
      lists.put(this.currentTaskList)
    },
    onSelectTask({ index }) {
      this.selectedTaskIndex =  index
    },
    onSetTaskDone({index, done}) {
      this.currentTaskList.tasks[index].done = done
      lists.put(this.currentTaskList)
    },
    onDeleteTask({index}) {
      this.currentTaskList.tasks.splice(index, 1)
      this.selectedTaskIndex = null
      lists.put(this.currentTaskList)
    }
  },
  template: `
    <div class="tab-tasks">
      <h1>Tarefas</h1>
      
      <div class="tab-tasks__content">

        <div class="tab-tasks__sidebar-left">
          <div class="tab-tasks__project-list">
            <div
              v-for="(taskList, index) of taskListsSummary"
              class="tab-tasks__tab-selector"
              :class="{ 'tab-tasks__tab-selector--active': activeIndex === index }"
              :key="taskList.id"
              @click="activeIndex = index, selectedTaskIndex = null"
            >
              <ProgressSummary
                :name="taskList.name"
                :status="taskList.status"
                :progress="taskList.progress"
              />
            </div>
            <button
              type="button"
              @click="createTaskList"
            >Adicionar</button>
          </div>
        </div>

        <TaskListEditor
          class="tab-tasks__editor"
          v-if="currentTaskList"
          :key="currentTaskList.id"
          :task-list="currentTaskList"
          :selected-task-index="selectedTaskIndex"
          @select-task="onSelectTask"
          @rename="onRenameCurrentTaskList"
          @delete="onDeleteCurrentTaskList"
          @rename-task="onRenameTask"
          @move-task-up="onMoveTaskUp"
          @move-task-down="onMoveTaskDown"
          @set-task-done="onSetTaskDone"
          @delete-task="onDeleteTask"
          @add-task="onAddTask"
        />
        
        <p v-else>Selecione uma lista de tarefas ao lado.</p>

      </div>
    </div>
  `
}



export default {
  id: 'tasks',  
  name: 'Tarefas',
  visibleInTabList: true,
  component,
  serialize,
  deserialize
}