import { ref, computed } from "vue";

export function handlePagination() {
  const page = ref(1);

  const data = Array.from(Array(24).keys()).map((item) => {
    return { index: item, value: `this_${item}` };
  });

  const perPage = 3;

  const paginatedData = computed(() =>
    data.slice((page.value - 1) * perPage, page.value * perPage)
  );

  const nextPage = () => {
    if (page.value !== Math.ceil(data.length / perPage)) {
      page.value += 1;
    }
  };

  const backPage = () => {
    if (page.value !== 1) {
      page.value -= 1;
    }
  };

  const goToPage = (numPage) => {
    page.value = numPage;
  };

  return { data, paginatedData, perPage, page, nextPage, backPage, goToPage };
}
