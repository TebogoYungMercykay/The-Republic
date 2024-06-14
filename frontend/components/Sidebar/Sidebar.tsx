"use client";
import {
  HomeIcon,
  ProfileIcon,
  VisualizationsIcon,
  LogoutIcon,
  ReportsIcon,
  NotificationsIcon,
  SettingsIcon
} from "../icons";

import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback
} from "@/components/ui/avatar";

import { HomeAvatarProps } from '@/lib/types';
import styles from "@/styles/Custom.module.css";
import { useUser } from "@/lib/contexts/UserContext";

import Link from 'next/link';

const Sidebar: React.FC<HomeAvatarProps> = ({ username = 'johndoe', fullname = 'John Doe', imageUrl = '' }) => {
  const { user } = useUser();

  return (
    <div className="w-[300px] border-r min-h-80vh">
      <div className={`${styles.sidebar} grow`}>
          <ul className={styles.sidebarLinks}>
            <h4>
              <span>General</span>
            </h4>
            <li>
              <Link href="/">
                <HomeIcon />
                Home
              </Link>
            </li>
            <li>
              <Link href="/visualizations">
                <VisualizationsIcon />
                Visualizations
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <ReportsIcon />
                Reports
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <NotificationsIcon />
                Notifications
              </Link>
            </li>
            <h4>
              <span>Account</span>
            </h4>
            <li>
              <Link href="/profile">
                <ProfileIcon />
                Profile
              </Link>
            </li>
            <li>
              <a href="/settings">
                <SettingsIcon />
                Settings
              </a>
            </li>
            <li>
              <Link href="/login">
                <LogoutIcon />
                Logout
              </Link>
            </li>
          </ul>
          <div className={styles.userAccount}>
            <div className={styles.userProfile}>
              <Avatar>
                <AvatarImage src={(user) ? user.image_url : imageUrl} />
                <AvatarFallback>{"JD"}</AvatarFallback>
              </Avatar>
              <div className={styles.userDetail}>
                <h3>{(user) ? user.fullname : fullname}</h3>
                <span>@{(user) ? user.username : username}</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
