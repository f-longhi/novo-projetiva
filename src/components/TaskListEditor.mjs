export default {
  props: {
    taskList: Object,
    selectedTaskIndex: [Number, Object]
  },
  computed: {
    selectedTask() {
      return this.selectedTaskIndex === null ? null : this.taskList.tasks[this.selectedTaskIndex]
    }
  },
  methods: {
    onNewTaskInputValueChanged(e) {
      this.$emit('add-task', {
        text: e.target.value
      })
      e.target.value = ''
    }
  },
  template: `
    <div class="task-list-editor">
      
      <h3 class="task-list-editor__title">
        <input
          size="36"
          :value="taskList.name"
          @change="$emit('rename', { name: $event.target.value})"
          />
        <button
          type="button"
          @click="$emit('delete')"
        >Excluir</button>
      </h3>
      
      <div class="task-list-editor__content">
          
          <ol class="task-list-editor__task-list">
            <li
              v-for="(task, i) of taskList.tasks"
              :key="i + '-' + task.text"
              class="task-list-editor__task-list-item"
              :class="{ 'task-list-editor__task-list-item--selected': selectedTaskIndex === i }"
            >
              <input
                type="checkbox"
                :checked="task.done"
                @change="$emit('set-task-done', {index: i, done: $event.target.checked})"
              />
              <label
                class="task-list-editor__task-list-item-label"
                @click="$emit('select-task', {index: i})"
              >
                {{task.text}}
              </label>
            </li>
            <li class="task-list-editor__task-list-item">
              <input
                type="checkbox"
                disabled
              />
              <input
                class="task-list-editor__task-list-item-label"
                type="text"
                size="40"
                value=""
                placeholder="Adicionar tarefa"
                @change="onNewTaskInputValueChanged"
              />
            </li>
          </ol>
        
        <div class="task-list-editor__actions-panel">
          <ul
            v-if="selectedTask !== null"
            class="task-list-editor__actions-list"
          >
          
            <li class="task-list-editor__action">
              <textarea
                class="task-list-editor__task-text-input"
                type="text"
                size="40"
                rows="3"
                :value="selectedTask.text"
                @change="$emit('rename-task', {index: selectedTaskIndex, name: $event.target.value})"
                @keydown.enter.prevent="$event.target.blur(), $event.target.focus()"
              ></textarea>
            </li>
          
            <li class="task-list-editor__action">
              <button
                class="task-list-editor__action-button"
                type="button"
                @click="$emit('set-task-done', {index: selectedTaskIndex, done: !selectedTask.done})"
              >{{ selectedTask.done ? 'Marcar como a fazer' : 'Marcar como feito' }}</button>
            </li>
            

            <li class="task-list-editor__action">
              <button
                class="task-list-editor__action-button"
                type="button"
                :disabled="selectedTaskIndex === 0"
                @click="$emit('move-task-up', { index: selectedTaskIndex })"
              >Mover para cima</button>
            </li>
            
            <li class="task-list-editor__action">
              <button
                class="task-list-editor__action-button"
                type="button"
                :disabled="selectedTaskIndex === taskList.tasks.length - 1"
                @click="$emit('move-task-down', { index: selectedTaskIndex })"
              >Mover para baixo</button>
            </li>
            
            
            <li class="task-list-editor__action">
              <button
                class="task-list-editor__action-button"
                type="button"
                @click="$emit('delete-task', { index: selectedTaskIndex })"
              >Excluir</button>
            </li>
            
            
          </ul>
          
        </div>
      
      </div>
      
    </div>
  `
}