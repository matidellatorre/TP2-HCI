import { defineStore } from "pinia";
import {CycleExerciseApi} from "@/api/cycleExercise";

export const useCycleExerciseStore = defineStore("cycleExercise", {
    state: () => ({ items: [] }),
    getters: {
        findIndex() {
            return (cycleExercise) => {
                return this.items.findIndex(item => item.exercise.id === cycleExercise.exercise.id)
            }
        },
    },
    actions: {
        push(cycleExercise) {
            this.items.push(cycleExercise);
        },
        replace(index, cycleExercise) {
            this.items[index] = cycleExercise;
        },
        splice(index, cycleExercise) {
            this.items.splice(index, 1, cycleExercise);
        },
        remove(index) {
            this.items.splice(index, 1);
        },
        replaceAll(cycleExercises) {
            this.items = cycleExercises;
        },
        async create(cycleId, exerciseId, cycleExercise) {
            const result = await CycleExerciseApi.add(cycleId, exerciseId, cycleExercise);
            this.push(result);
            return result;
        },
        async modify(cycleId, cycleExercise) {
            const result = await CycleExerciseApi.modify(cycleId, cycleExercise.exercise.id, cycleExercise);
            const index = this.findIndex(result);
            if (index >= 0)
                this.splice(index, result);
            return result;
        },
        async delete(cycleId, cycleExercise) {
            await CycleExerciseApi.delete(cycleId, cycleExercise.exercise.id);
            const index = this.findIndex(cycleExercise);
            if (index >= 0)
                this.remove(index);
        },
        async get(cycleId, cycle) {
            const index = this.findIndex(cycle);
            if (index >= 0)
                return this.items[index];
            const result = await CycleExerciseApi.get();
            this.push(result);
            return result;
        },
        async getAll(cycleId, controller) {
            const result = await CycleExerciseApi.getAll(cycleId, controller);
            this.replaceAll(result.content);
            return result;
        }
    },
});
