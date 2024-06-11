import React from 'react';
import { Button } from 'flowbite-react';

const GradientButton = ({ children, ...props }) => {
  return (
    <Button gradientDuoTone="purpleToBlue" {...props}>
      {children}
    </Button>
  );
};

export default GradientButton;
