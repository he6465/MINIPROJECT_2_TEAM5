import React from 'react';
import logoUrl from '/logo.png';

type LogoProps = {
  size?: number;
};

const Logo: React.FC<LogoProps> = ({ size = 56 }) => {
  return (
    <img
      src={logoUrl}
      alt="Health Routine Tracker"
      height={size}
      width={size}
      style={{ display: 'inline-block', height: size, width: size, verticalAlign: 'middle', objectFit: 'contain' }}
      loading="eager"
      decoding="async"
    />
  );
};

export default Logo;


