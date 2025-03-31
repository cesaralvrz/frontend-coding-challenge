<template>
<div class="relative text-gray-800 border-none">
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      class="w-full px-4 py-2 shadow-sm rounded-lg focus:outline-none focus:ring-2 bg-white focus:ring-teal-500"
      :placeholder="placeholder"
    />
    
    <div v-if="showSuggestions && suggestions.length > 0" 
         class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
      <ul>
        <li v-for="suggestion in suggestions" 
            :key="suggestion.id"
            @mousedown="selectSuggestion(suggestion)"
            class="px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          {{ suggestion.name }}
        </li>
      </ul>
    </div>

    <div v-if="isLoading" class="absolute right-3 top-2.5">
      <div class="w-5 h-5 border-2 border-teal-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { debounce } from '~/utils';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  searchFunction: {
    type: Function,
    required: true
  },
  debounceTime: {
    type: Number,
    default: 300
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const suggestions = ref([]);
const isLoading = ref(false);
const showSuggestions = ref(false);

const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) {
    suggestions.value = [];
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    suggestions.value = await props.searchFunction(query);
  } catch (error) {
    console.error('Search error:', error);
    suggestions.value = [];
  } finally {
    isLoading.value = false;
  }
}, props.debounceTime);

const handleInput = (event) => {
  const value = event.target.value;
  emit('update:modelValue', value);
  debouncedSearch(value);
};

const handleFocus = () => {
  showSuggestions.value = true;
};

const handleBlur = () => {
  // Delay hiding suggestions to allow click events to fire
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const selectSuggestion = (suggestion) => {
  emit('update:modelValue', suggestion.name);
  emit('select', suggestion);
  suggestions.value = [];
  showSuggestions.value = false;
};
</script>