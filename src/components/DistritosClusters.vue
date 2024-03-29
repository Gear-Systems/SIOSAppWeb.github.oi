<template>
  <div class="mt-5 flex flex-col lg:flex-row h-full w-full">
    <!-- Agregar nuevo distrito o cluster -->
    <div class="flex basis-[40%] justify-center">
      <div class="flex flex-col space-y-5">
        <h2 class="text-xl font-semibold">Agregar nuevo</h2>
        <!-- tipo de -->
        <Listbox v-model="formData.tipo">
          <div class="relative">
            <ListboxLabel class="text-sm text-gray-500">Distrito o cluster</ListboxLabel>
            <ListboxButton
              class="shadow- relative w-full max-w-sm cursor-pointer rounded-md border-[1.5px] border-[#7C8495] py-3 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">{{ formData.tipo }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <SelectorIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-30 mt-1 max-h-60 w-full max-w-sm overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="item in data"
                  :key="item"
                  :value="item"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-gray-100' : 'text-gray-900',
                      'relative w-full cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block w-full truncate',
                      ]"
                      >{{ item }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <!-- Nombre -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-500" for="name">Nombre</label>
          <input
            v-model="formData.nombre"
            class="max-w-sm rounded-md border-[1.5px] border-[#7C8495] bg-transparent font-semibold placeholder:text-sm placeholder:font-normal placeholder:text-black focus:ring-0"
            type="text"
            id="name"
          />
        </div>

        <div class="flex w-full justify-end">
          <button
            @click="guardar"
            type="button"
            class="rounded-md bg-primario py-2 px-6 font-light text-white hover:bg-primario/60"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de distritos o clusters agregados -->
    <div class="mt-12 lg:mt-0 flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12 w-full justify-end">
      <div>
        <div><h2 class="text-xl font-semibold text-center">Distritos</h2></div>
        <DistritosClustersTable :distritosClustersData="distritosData" />
      </div>
      <div>
        <div><h2 class="text-xl font-semibold text-center">Clusters</h2></div>
        <DistritosClustersTable :distritosClustersData="clustersData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";
import {
  getDatabase,
  ref as refDB,
  get,
  child,
  set,
  serverTimestamp,
  onChildRemoved,
  onChildAdded,
} from "firebase/database";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel
} from "@headlessui/vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import DistritosClustersTable from "./DistritosClustersTable.vue";

const db = getDatabase();
const data = reactive(["Distritos", "Clusters"]);
const formData = reactive({
  nombre: null,
  tipo: data[0],
});

const distritosData = ref([]);
const clustersData = ref([]);
const rules = computed(() => {
  return {
    nombre: required,
    tipo: required,
  };
});

// Obtener distritos desde base de datos
await onChildAdded(refDB(db, `catalogo/distritos`), (snapshot) => {
  distritosData.value.push({
    nombre: snapshot.key,
    tipo: "Distritos",
  });
});
// Obtener clusters desde base de datos
await onChildAdded(refDB(db, `catalogo/clusters`), (snapshot) => {
  clustersData.value.push({
    nombre: snapshot.key,
    tipo: "Clusters",
  });
});

// Eliminar item de array distrito si se eliminó desde base de datos
onChildRemoved(refDB(db, `catalogo/distritos`), (snapshot) => {
  distritosData.value = distritosData.value.filter((value) => {
    if (value.nombre !== snapshot.key) {
      return value;
    }
  });
});

// Eliminar item de array cluster si se eliminó desde base de datos
onChildRemoved(refDB(db, `catalogo/clusters`), (snapshot) => {
  clustersData.value = clustersData.value.filter((value) => {
    if (value.nombre !== snapshot.key) {
      return value;
    }
  });
});

const $v = useVuelidate(rules, formData);

// Guardar valor en base de datos
const guardar = () => {
  let result = $v.value.$validate();
  if (formData.tipo && result) {
    set(
      refDB(db, `/catalogo/${formData.tipo.toLowerCase()}/${formData.nombre}`),
      {
        creado: serverTimestamp(),
      }
    )
      .then((snapshot) => {
        formData.nombre = null;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>
