<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center rounded-md bg-opacity-20 px-1.5 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <img src="/img/menu_puntos.svg" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute left-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="px-1 py-1">
          <MenuItem v-if="props.data.asignado" v-slot="{ active }">
            <button
              @click="desasignarFolio()"
              :class="[
                active ? 'bg-[#E9F0FC] text-primario' : 'text-black',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]"
            >
              <DesasignarFolioIco
                class="mr-2 h-5 w-5 text-violet-400"
                aria-hidden="true"
                :color="active ? '#2166E5' : '#101010'"
              />
              Desasignar folio
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="eliminarFolio()"
              :class="[
                active ? 'bg-[#E9F0FC] text-primario' : 'text-black',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]"
            >
              <TrashIco
                class="mr-2 h-4 w-5 text-violet-400"
                aria-hidden="true"
                :color="active ? '#2166E5' : '#101010'"
              />
              Eliminar folio
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import DesasignarFolioIco from "./iconos/DesasignarFolioIco.vue";
import TrashIco from "./iconos/TrashIco.vue";
import { db } from "@/firebase/firebase";
import { ref as refDB, remove, get, update } from "firebase/database";
import { useRouter } from "vue-router";

const props = defineProps(["data"]);
const router = useRouter();

const desasignarFolio = async () => {
  const result = await get(
    refDB(db, `folios/${props.data.incidencia}/${props.data.folioKey}`)
  );
  if (result.val().asignado) {
    const folioAsignado = await get(
      refDB(
        db,
        `foliosAsignados/${props.data.incidencia}/${result.val().tecnico}`
      )
    );
    if (folioAsignado.hasChild("activo")) {
      if (folioAsignado.val()["activo"] === props.data.folioKey) {
        await remove(
          refDB(
            db,
            `foliosAsignados/${props.data.incidencia}/${
              result.val().tecnico
            }/activo`
          )
        ).then(async () => {
          if (
            props.data.incidencia === "correctivos" &&
            folioAsignado.hasChild("pendientes")
          ) {
            await update(
              refDB(
                db,
                `foliosAsignados/${props.data.incidencia}/${
                  result.val().tecnico
                }`
              ),
              {
                activo: Object.keys(folioAsignado.val()["pendientes"])[0],
              }
            ).then(async () => {
              await remove(
                refDB(
                  db,
                  `foliosAsignados/${props.data.incidencia}/${
                    result.val().tecnico
                  }/pendientes/${
                    Object.keys(folioAsignado.val()["pendientes"])[0]
                  }`
                )
              );
            });
          }
        });
        if (folioAsignado.hasChild("pendientes")) {
        }
      } else {
        await remove(
          refDB(
            db,
            `foliosAsignados/${props.data.incidencia}/${
              result.val().tecnico
            }/pendientes/${props.data.folioKey}`
          )
        );
      }
    }
  }
  await update(
    refDB(db, `folios/${props.data.incidencia}/${props.data.folioKey}`),
    { asignado: false }
  );
  router.go(0);
};

const eliminarFolio = async () => {
  const result = await get(
    refDB(db, `folios/${props.data.incidencia}/${props.data.folioKey}`)
  );
  if (result.val().asignado) {
    const folioAsignado = await get(
      refDB(
        db,
        `foliosAsignados/${props.data.incidencia}/${result.val().tecnico}`
      )
    );
    if (folioAsignado.hasChild("activo")) {
      if (folioAsignado.val()["activo"] === props.data.folioKey) {
        await remove(
          refDB(
            db,
            `foliosAsignados/${props.data.incidencia}/${
              result.val().tecnico
            }/activo`
          )
        ).then(async () => {
          if (
            props.data.incidencia === "correctivos" &&
            folioAsignado.hasChild("pendientes")
          ) {
            await update(
              refDB(
                db,
                `foliosAsignados/${props.data.incidencia}/${
                  result.val().tecnico
                }`
              ),
              {
                activo: Object.keys(folioAsignado.val()["pendientes"])[0],
              }
            ).then(async () => {
              await remove(
                refDB(
                  db,
                  `foliosAsignados/${props.data.incidencia}/${
                    result.val().tecnico
                  }/pendientes/${
                    Object.keys(folioAsignado.val()["pendientes"])[0]
                  }`
                )
              );
            });
          }
        });
        if (folioAsignado.hasChild("pendientes")) {
        }
      } else {
        await remove(
          refDB(
            db,
            `foliosAsignados/${props.data.incidencia}/${
              result.val().tecnico
            }/pendientes/${props.data.folioKey}`
          )
        );
      }
    }
  }
  await remove(
    refDB(db, `folios/${props.data.incidencia}/${props.data.folioKey}`)
  );
  router.go(0);
};
</script>
