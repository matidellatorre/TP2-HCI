<template>
  <div id="div-container">
    <v-btn v-if="allowEditing" large color="secondary" class="onTop" fixed right bottom rounded @click="showPopUp=true">
      <span>Add exercise</span>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-list v-if="this.$cycleExercises.length!=0" class="justify-center text-center align-center py-1 pr-2 pl-4" color="white" width="100%">
      <div v-for="cycleExercise in this.$cycleExercises" :key="cycleExercise.order">
        <v-card v-bind:color="cycleExercise.exercise.type==='exercise'?'white':'blue'" class="ma-1 elevation-2">
          <v-list-item v-bind:class="{dense: cycleExercise.exercise.type==='rest'}">
            <v-list-item-content>
              <v-container>
                <v-row>
                  <v-col class="d-flex align-center">
                    <h3>{{ cycleExercise.exercise.name }}</h3>
                  </v-col>
                  <v-col class="d-flex justify-center">
                    <div v-if="cycleExercise.exercise.type==='exercise' && cycleExercise.repetitions !== 0" class="d-flex align-center mr-2">
                      <v-icon>mdi-sync</v-icon>
                      <p class="ml-1 my-0">{{ cycleExercise.repetitions }} repetitions</p>
                    </div>
                    <div v-if="cycleExercise.duration !== 0" class="d-flex align-center ml-2">
                      <v-icon>mdi-clock</v-icon>
                      <p class="ml-1 my-0">{{ cycleExercise.duration }} seconds</p>
                    </div>
                  </v-col>
                  <v-col v-if="allowEditing" class="d-flex justify-end">
                    <v-btn @click="editCycleExercise=cycleExercise; showEdit=true" outlined class="mr-4">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn @click="deleteExercise(cycleExercise)" outlined color="red">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </v-list>
    <EmptyState title="You have no exercises in this cycle" subtitle="To create an exercise or a rest, click on the ADD EXERCISE button" v-else />
    <CreateExercisePopUp v-if="allowEditing" :show="this.showPopUp" @popUpClosed="showPopUp=false"/>
    <edit-exercise-pop-up v-if="allowEditing" :show="this.showEdit" :editing-cycle-exercise="editCycleExercise" @popUpClosed="showEdit=false"/>
  </div>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {useSecurityStore} from "@/store/SecurityStore";
import {useCycleStore} from "@/store/CycleStore";
import {useCycleExerciseStore} from "@/store/CycleExerciseStore";
import CreateExercisePopUp from "@/components/CreateExercisePopUp";
import EditExercisePopUp from "@/components/EditExercisePopUp";
import EmptyState from "@/components/EmptyState";

export default {
  name: "ExerciseList",
  components: {EmptyState, EditExercisePopUp, CreateExercisePopUp},
  props: {
    allowEditing: Boolean,
  },
  data() {
    return {
      cycleExercises: null,
      result: null,
      editCycleExercise: null,
      controller: null,
      showPopUp: false,
      showEdit: false,
    }
  },
  computed: {
    ...mapState(useSecurityStore, {
      $user: state => state.user,
    }),
    ...mapState(useSecurityStore, {
      $isLoggedIn: 'isLoggedIn'
    }),
    ...mapState(useCycleStore, {
      $cycle: state => state.items,
      $selectedCycleId: 'selectedCycleId',
    }),
    ...mapState(useCycleExerciseStore, {
      $cycleExercises: state => state.items,
    }),
  },
  methods: {
    ...mapActions(useSecurityStore, {
      $getCurrentUser: 'getCurrentUser',
    }),
    ...mapActions(useCycleExerciseStore, {
      $createCycleExercise: 'create',
      $modifyCycleExercise: 'modify',
      $deleteCycleExercise: 'delete',
      $getCycleExercise: 'get',
      $getAllCycleExercises: 'getAll',
    }),
    ...mapActions(useCycleStore, {
      $setSelectedCycleId: 'setSelectedCycleId',
    }),
    setResult(result) {
      this.result = result
    },
    clearResult() {
      this.result = null
    },
    async getCurrentUser() {
      await this.$getCurrentUser()
      this.setResult(this.$user)
    },
    async getAllCycleExercises(cycleId) {
      try {
        this.controller = new AbortController()
        const cycleExercises = await this.$getAllCycleExercises(cycleId, this.controller);
        this.controller = null
        this.setResult(cycleExercises)
      } catch (e) {
        this.setResult(e)
      }
    },
    async deleteExercise(cycleExercise) {
      try{
        this.controller = new AbortController()
        const cycleExercises = await this.$deleteCycleExercise(this.$selectedCycleId, cycleExercise, this.controller);
        this.controller = null
        this.setResult(cycleExercises)
      } catch (e) {
        this.setResult(e)
      }
    },
    abort() {
      this.controller.abort()
    }
  },
  watch: {
    $selectedCycleId: function () {
      this.getAllCycleExercises(this.$selectedCycleId);
    },
    $cycle: function () {
      this.$setSelectedCycleId(0);
    }
  },
  created() {
    if(this.$selectedCycleId)
      this.getAllCycleExercises(this.$selectedCycleId);
  }
}

</script>
<style scoped>
#div-container {
  width: 100%;
}
.onTop{
  z-index: 20;
}
.dense{
  height: 50px;
}
</style>