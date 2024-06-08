import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
 
} from 'react-icons/hi';

export default function DashSidebar() {
  
  return (
    <Sidebar className='w-full md:w-56' >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Sidebar.Item active icon={HiUser} label = {'User'} labelColor='dark'>
                Profile
            </Sidebar.Item>
            <Sidebar.Item icon={HiArrowSmRight} className ='cursor-pointer'>
                Sign Out
            </Sidebar.Item>

        </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  );
}