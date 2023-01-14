import Image from 'next/image';
import { memo } from 'react';
import Tooltip from './Tooltip';

type SidebarProps = {
  cartlen: number;
};

function Sidebar({ cartlen }: SidebarProps) {
  return (
    <div className="bg-white w-24 h-full flex flex-col justify-between py-8 fixed">
      <Image src={'/logo.svg'} alt="logo" width="39px" height="39px" className="mx-auto" />
      <ul className="flex flex-col gap-8">
        <li className="relative flex items-center">
          <span className="absolute w-2 h-10 bg-primary rounded left-[-3px]"></span>
          <div className="mx-auto w-fit cursor-pointer">
            <Tooltip content="items">
              <span className="material-symbols-outlined">format_list_bulleted</span>
            </Tooltip>
          </div>
        </li>
        <li className="relative flex items-center">
          <div className="mx-auto w-fit cursor-pointer">
            <Tooltip content="history">
              <span className="material-symbols-outlined">replay</span>
            </Tooltip>
          </div>
        </li>
        <li className="relative flex items-center">
          <div className="mx-auto w-fit cursor-pointer">
            <Tooltip content="statistics">
              <span className="material-symbols-outlined">insert_chart</span>
            </Tooltip>
          </div>
        </li>
      </ul>
      <div className="flex">
        <span className="material-symbols-outlined relative bg-primary rounded-full p-2 mx-auto text-white w-10 cursor-pointer">
          shopping_cart
          <span className="absolute w-4 h-4 bg-redBg top-[-3px] right-[-3px] rounded text-white text-xs text-center font-semibold">
            {cartlen}
          </span>
        </span>
      </div>
    </div>
  );
}
export default memo(Sidebar);
