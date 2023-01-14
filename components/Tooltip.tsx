import { useState } from 'react';
import styles from '../styles/Tooltip.module.css';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

function Tooltip({ ...props }: TooltipProps) {
  const [display, setDisplay] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseOver={() => setDisplay(true)}
      onMouseOut={() => setDisplay(false)}
    >
      <span
        className={`absolute text-sm bg-[#111827] py-2 px-3 text-white left-8 bottom-0 rounded-lg after:border-[6px] after:border-transparent after:border-r-black after:absolute after:-left-3 after:bottom-3 ${
          styles.fadeIn
        }  ${display ? '' : 'hidden'}`}
      >
        {props.content}
      </span>
      {props.children}
    </div>
  );
}

export default Tooltip;
