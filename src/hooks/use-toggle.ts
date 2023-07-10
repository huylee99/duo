import { useState } from "react";

type useToggleArgs = {
  initialValue: boolean;
};

const useToggle = (args?: useToggleArgs) => {
  const [value, setValue] = useState(() => args?.initialValue ?? false);

  const onClose = () => setValue(false);
  const onOpen = () => setValue(true);

  const onChange = (value: boolean) => setValue(value);

  return {
    value,
    onClose,
    onOpen,
    onChange,
  };
};

export default useToggle;
