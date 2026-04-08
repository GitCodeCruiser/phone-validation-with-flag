import { defineComponent, h, ref, onMounted, onUnmounted, watch } from 'vue';
import { PhoneInput } from '../PhoneInput.js';

export default defineComponent({
  name: 'PhoneInput',
  props: {
    modelValue: Object,
    defaultCountry: { type: String, default: 'US' },
    placeholder: { type: String, default: 'Phone number' },
    searchPlaceholder: String,
    theme: { type: String, default: 'auto' },
    disabled: { type: Boolean, default: false },
    flagType: { type: String, default: 'image' },
    flagsUrl: String,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const elRef = ref(null);
    let instance = null;

    onMounted(() => {
      instance = new PhoneInput(elRef.value, {
        defaultCountry: props.defaultCountry,
        value: props.modelValue,
        placeholder: props.placeholder,
        searchPlaceholder: props.searchPlaceholder,
        theme: props.theme,
        disabled: props.disabled,
        flagType: props.flagType,
        flagsUrl: props.flagsUrl,
        onChange: (val) => {
          emit('update:modelValue', val);
          emit('change', val);
        },
      });
    });

    onUnmounted(() => instance?.destroy());

    watch(() => props.disabled, (val) => {
      val ? instance?.disable() : instance?.enable();
    });

    return () => h('div', { ref: elRef });
  },
});
