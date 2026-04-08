import { useEffect, useRef } from 'react';
import { PhoneInput } from '../PhoneInput.js';

export function PhoneInputComponent(props) {
  const {
    defaultCountry, value, placeholder, searchPlaceholder,
    theme, disabled, flagType, flagsUrl, onChange, onInput, ...rest
  } = props;

  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    instanceRef.current = new PhoneInput(ref.current, {
      defaultCountry, value, placeholder, searchPlaceholder,
      theme, disabled, flagType, flagsUrl, onChange, onInput,
    });
    return () => instanceRef.current?.destroy();
  }, []);

  // Sync disabled
  useEffect(() => {
    if (!instanceRef.current) return;
    disabled ? instanceRef.current.disable() : instanceRef.current.enable();
  }, [disabled]);

  return React.createElement('div', { ref, ...rest });
}
